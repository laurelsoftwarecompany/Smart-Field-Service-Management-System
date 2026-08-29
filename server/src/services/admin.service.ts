import User from '../models/User';
import ServiceCategory from '../models/ServiceCategory';
import ServiceRequest from '../models/ServiceRequest';
import Job from '../models/Job';
import Technician from '../models/Technician';
import { JobStatus, TechnicianAvailability } from '../types';

export class AdminService {
  // ── User Management ──────────────────────────────────────────────────────
  static async getUsers(role?: string, page = 1, limitNum = 20) {
    const skip = (page - 1) * limitNum;
    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        page,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }
  static async updateUser(id: string, data: any) {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }
  static async deactivateUser(id: string) {
    return await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
  // ── Service Category Management ──────────────────────────────────────────
  static async getCategories() {
    return await ServiceCategory.find().sort({ name: 1 });
  }
  static async createCategory(data: any) {
    const existing = await ServiceCategory.findOne({ name: data.name });
    if (existing) {
      throw new Error('Category already exists.');
    }
    return await ServiceCategory.create(data);
  }
  static async updateCategory(id: string, data: any) {
    return await ServiceCategory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }
  static async deactivateCategory(id: string) {
    return await ServiceCategory.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
  // ── Analytics ─────────────────────────────────────────────────────────────
  static async getDashboardStats() {
    const [
      totalRequests,
      pendingRequests,
      activeJobs,
      completedJobs,
      highPriorityCount,
      criticalPriorityCount,
      totalTechnicians,
      availableTechnicians,
    ] = await Promise.all([
      ServiceRequest.countDocuments(),
      ServiceRequest.countDocuments({ status: 'Pending' } as any),
      Job.countDocuments({
        status: {
          $in: [JobStatus.ASSIGNED, JobStatus.ACCEPTED, JobStatus.ON_THE_WAY, JobStatus.IN_PROGRESS],
        },
      } as any),
      Job.countDocuments({ status: JobStatus.COMPLETED } as any),
      ServiceRequest.countDocuments({ priority: 'High' } as any),
      ServiceRequest.countDocuments({ priority: 'Critical' } as any),
      Technician.countDocuments({ isActive: true } as any),
      Technician.countDocuments({
        isActive: true,
        availability: TechnicianAvailability.AVAILABLE,
      } as any),
    ]);

    const highPriorityRequests = highPriorityCount + criticalPriorityCount;
    const busyTechnicians = totalTechnicians - availableTechnicians;
    const technicianUtilization = totalTechnicians > 0 ? Math.round((busyTechnicians / totalTechnicians) * 100) : 0;

    const completedJobsData = await Job.find({
      status: JobStatus.COMPLETED,
      assignedAt: { $exists: true },
      completedAt: { $exists: true },
    } as any).select('assignedAt completedAt');

    let avgResolutionTime = 0;
    if (completedJobsData.length > 0) {
      const totalTime = completedJobsData.reduce((sum, job) => {
        const diff = new Date(job.completedAt!).getTime() - new Date(job.assignedAt).getTime();
        return sum + diff;
      }, 0);
      avgResolutionTime = totalTime / completedJobsData.length / (1000 * 60 * 60);
    }

    return {
      totalRequests,
      pendingRequests,
      activeJobs,
      completedJobs,
      highPriorityRequests,
      totalTechnicians,
      availableTechnicians,
      technicianUtilization,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
    };
  }
  static async getSystemAnalytics() {
    const [requestsByStatus, jobsByStatus, requestsByCategory, requestsByPriority, topTechnicians] = await Promise.all([
      ServiceRequest.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Job.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      ServiceRequest.aggregate([
        { $match: { category: { $ne: '' } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      ServiceRequest.aggregate([
        { $match: { priority: { $ne: '' } } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Technician.find({ isActive: true }).sort({ jobsCompleted: -1 }).limit(10).select('name jobsCompleted rating availability'),
    ]);

    return {
      requestsByStatus,
      jobsByStatus,
      requestsByCategory,
      requestsByPriority,
      topTechnicians,
    };
  }
}
