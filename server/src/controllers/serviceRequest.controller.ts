import { Request, Response } from 'express';
import ServiceRequest from '../models/ServiceRequest';
import { serviceRequestSchema } from '../validators';

export const createServiceRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validation = serviceRequestSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: 'Validation error', errors: validation.error.flatten() });
    return;
  }

  // Create the service request — AI/ML fields left empty
  // The AI/ML service will populate: category, priority, aiConfidence, recommendedTechnicianId, summary
  const serviceRequest = await ServiceRequest.create(validation.data);

  res.status(201).json({
    message: 'Service request created.',
    serviceRequest,
  });
};

export const getServiceRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    status,
    priority,
    category,
    page = '1',
    limit = '20',
  } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter: Record<string, unknown> = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;

  const [requests, total] = await Promise.all([
    ServiceRequest.find(filter)
      .populate('customerId', 'name email phone')
      .populate('recommendedTechnicianId', 'name email')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }),
    ServiceRequest.countDocuments(filter),
  ]);

  res.json({
    requests,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
};

export const getServiceRequestById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const serviceRequest = await ServiceRequest.findById(req.params.id)
    .populate('customerId', 'name email phone address')
    .populate('recommendedTechnicianId', 'name email specializations');

  if (!serviceRequest) {
    res.status(404).json({ message: 'Service request not found.' });
    return;
  }

  res.json({ serviceRequest });
};
