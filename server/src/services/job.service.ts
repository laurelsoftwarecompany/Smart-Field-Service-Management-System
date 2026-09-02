import Job from '../models/Job';
import ServiceRequest from '../models/ServiceRequest';
import Technician from '../models/Technician';
import { ServiceRequestStatus, JobStatus, TechnicianAvailability } from '../types';
import { getIO } from '../config/socket';
import axios from 'axios';
import mongoose from 'mongoose';

export class JobService {
  // Helper to call Python FastAPI AI Service
  private static async classifyWithAI(description: string) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/classify', {
        description
      });
      return response.data; // Returns category, priority, aiConfidence, recommendedTechnicianId, summary
    } catch (error) {
      console.error('AI Service Connection Error:', error);
      // Fallback default values if Python service is down
      return {
        category: 'General Appliance Repair',
        priority: 'Medium',
        aiConfidence: 0.5,
        recommendedTechnicianId: null,
        summary: 'AI service unavailable, default routing applied.'
      };
    }
  }

  static async createJob(serviceRequestId: string, technicianId?: string) {
    const serviceRequest = await ServiceRequest.findById(new mongoose.Types.ObjectId(serviceRequestId));
    if (!serviceRequest) throw new Error('Service request not found.');
    if (serviceRequest.status === ServiceRequestStatus.ASSIGNED) throw new Error('Service request is already assigned.');

    // Call Python AI service to get smart classification and technician suggestion
    const aiResult = await JobService.classifyWithAI(serviceRequest.description);

    // Use explicit technicianId if provided
    let assignedTechId = technicianId;

    // Agar explicit ID nahi di, toh pehle check karo kya AI ne valid ObjectId di hai
    if (!assignedTechId && aiResult.recommendedTechnicianId && mongoose.Types.ObjectId.isValid(aiResult.recommendedTechnicianId)) {
      assignedTechId = aiResult.recommendedTechnicianId;
    }

    // Agar ID nahi mili, toh database se available technician dhoondo
    if (!assignedTechId) {
      let foundTech = await Technician.findOne({
        specializations: { $in: [aiResult.category] },
        availability: TechnicianAvailability.AVAILABLE
      });

      if (!foundTech) {
        foundTech = await Technician.findOne({ availability: TechnicianAvailability.AVAILABLE });
      }

      if (foundTech) {
        assignedTechId = foundTech._id.toString();
      }
    }

    if (!assignedTechId) {
      throw new Error('No valid technician available or recommended by AI.');
    }

    const technician = await Technician.findById(new mongoose.Types.ObjectId(assignedTechId));
    if (!technician) throw new Error('Technician not found.');

    // Job create karte waqt ensure karein ke AI data properly map ho raha hai
    const jobData: any = {
      serviceRequestId: new mongoose.Types.ObjectId(serviceRequestId),
      technicianId: new mongoose.Types.ObjectId(assignedTechId),
      customerId: serviceRequest.customerId,
      status: JobStatus.ASSIGNED,
      assignedAt: new Date()
    };

    // Agar AI result mein data aa raha hai toh assign karo
    if (aiResult.category) jobData.category = aiResult.category;
    if (aiResult.priority) jobData.priority = aiResult.priority;
    if (aiResult.aiConfidence !== undefined) jobData.aiConfidence = aiResult.aiConfidence;
    if (aiResult.summary) jobData.summary = aiResult.summary;

    const job = await Job.create(jobData);

    serviceRequest.status = ServiceRequestStatus.ASSIGNED;
    await serviceRequest.save();

    technician.availability = TechnicianAvailability.BUSY;
    await technician.save();

    try {
      const io = getIO();
      io.to('dashboard').emit('job:created', job);
    } catch {}

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
    job.images.push(...imageUrlz);
    await job.save();

    return { job, imageUrls };
  }
}