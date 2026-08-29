import Job from '../models/Job';
import ServiceRequest from '../models/ServiceRequest';
import Technician from '../models/Technician';
import { ServiceRequestStatus, JobStatus, TechnicianAvailability } from '../types';
import { getIO } from '../config/socket';

export class JobService {
  static async createJob(serviceRequestId: string, technicianId: string) {
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) throw new Error('Service request not found.');
    if (serviceRequest.status === ServiceRequestStatus.ASSIGNED) throw new Error('Service request is already assigned.');

    const technician = await Technician.findById(technicianId);
    if (!technician) throw new Error('Technician not found.');

    const job = await Job.create({
      serviceRequestId,
      technicianId,
      customerId: serviceRequest.customerId,
      status: JobStatus.ASSIGNED,
      assignedAt: new Date(),
    });

    serviceRequest.status = ServiceRequestStatus.ASSIGNED;
    await serviceRequest.save();

    technician.availability = TechnicianAvailability.BUSY;
    await technician.save();

    try {
      const io = getIO();
      io.to('dashboard').emit('job:created', job);
    } catch {} // Socket might not be initialized during tests

    return await Job.findById(job._id)
      .populate('serviceRequestId')
      .populate('technicianId', 'name email phone')
      .populate('customerId', 'name email phone');
  }

  static async getJobs(status?: string, technicianId?: string, customerId?: string, page = 1, limitNum = 20) {
    const skip = (page - 1) * limitNum;
    const filter: Record<string, unknown> = {};

    if (status) filter.status = status;
    if (technicianId) filter.technicianId = technicianId;
    if (customerId) filter.customerId = customerId;

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('serviceRequestId')
        .populate('technicianId', 'name email phone specializations')
        .populate('customerId', 'name email phone')
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Job.countDocuments(filter),
    ]);

    return {
      jobs,
      pagination: {
        page,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  static async getJobById(id: string) {
    return await Job.findById(id)
      .populate('serviceRequestId')
      .populate('technicianId', 'name email phone specializations')
      .populate('customerId', 'name email phone address');
  }

  static async updateJobStatus(id: string, status: JobStatus) {
    const job = await Job.findById(id);
    if (!job) throw new Error('Job not found.');

    job.status = status;

    if (status === JobStatus.ACCEPTED) job.acceptedAt = new Date();
    else if (status === JobStatus.IN_PROGRESS) job.startedAt = new Date();
    else if (
      status === JobStatus.COMPLETED ||
      status === JobStatus.UNABLE_TO_COMPLETE ||
      status === JobStatus.CUSTOMER_UNAVAILABLE
    ) {
      job.completedAt = new Date();

      await Technician.findByIdAndUpdate(job.technicianId, { availability: TechnicianAvailability.AVAILABLE });

      if (status === JobStatus.COMPLETED) {
        await Technician.findByIdAndUpdate(job.technicianId, { $inc: { jobsCompleted: 1 } });
      }

      await ServiceRequest.findByIdAndUpdate(job.serviceRequestId, { status: ServiceRequestStatus.CLOSED });
    }

    await job.save();

    try {
      const io = getIO();
      io.to('dashboard').emit('job:statusUpdated', { jobId: job._id, status: job.status });
    } catch {}

    return job;
  }

  static async addServiceNote(id: string, noteData: any) {
    const job = await Job.findById(id);
    if (!job) throw new Error('Job not found.');

    job.notes.push(noteData);
    await job.save();
    return job;
  }

  static async uploadJobImages(id: string, files: Express.Multer.File[]) {
    const job = await Job.findById(id);
    if (!job) throw new Error('Job not found.');

    const imageUrls = files.map((file) => `/uploads/${file.filename}`);
    job.images.push(...imageUrls);
    await job.save();

    return { job, imageUrls };
  }
}
