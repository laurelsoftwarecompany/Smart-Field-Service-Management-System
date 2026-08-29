import { Request, Response } from 'express';
import { JobService } from '../services/job.service';
import { createJobSchema, updateJobStatusSchema, serviceNoteSchema } from '../validators';
import { JobStatus } from '../types';

export const createJob = async (req: Request, res: Response): Promise<void> => {
  const validation = createJobSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: 'Validation error', errors: validation.error.flatten() });
    return;
  }

  try {
    const job = await JobService.createJob(validation.data.serviceRequestId, validation.data.technicianId);
    res.status(201).json({ message: 'Job created and technician assigned.', job });
  } catch (error: any) {
    res.status(error.message.includes('not found') ? 404 : 400).json({ message: error.message });
  }
};

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  const { status, technicianId, customerId, page = '1', limit = '20' } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  const result = await JobService.getJobs(
    status as string,
    technicianId as string,
    customerId as string,
    pageNum,
    limitNum
  );

  res.json(result);
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
  const job = await JobService.getJobById(req.params.id as string);
  if (!job) {
    res.status(404).json({ message: 'Job not found.' });
    return;
  }
  res.json({ job });
};

export const updateJobStatus = async (req: Request, res: Response): Promise<void> => {
  const validation = updateJobStatusSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: 'Validation error', errors: validation.error.flatten() });
    return;
  }

  try {
    const job = await JobService.updateJobStatus(req.params.id as string, validation.data.status as JobStatus);
    res.json({ message: 'Job status updated.', job });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const addServiceNote = async (req: Request, res: Response): Promise<void> => {
  const validation = serviceNoteSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: 'Validation error', errors: validation.error.flatten() });
    return;
  }

  try {
    const job = await JobService.addServiceNote(req.params.id as string, validation.data);
    res.json({ message: 'Service note added.', job });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const uploadJobImages = async (req: Request, res: Response): Promise<void> => {
  if (!req.files || !(req.files as Express.Multer.File[]).length) {
    res.status(400).json({ message: 'No images uploaded.' });
    return;
  }

  try {
    const { job, imageUrls } = await JobService.uploadJobImages(req.params.id as string, req.files as Express.Multer.File[]);
    res.json({ message: 'Images uploaded.', images: imageUrls, job });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
