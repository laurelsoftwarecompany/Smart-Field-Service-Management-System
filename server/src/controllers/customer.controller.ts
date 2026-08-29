import { Request, Response } from 'express';
import Customer from '../models/Customer';
import ServiceRequest from '../models/ServiceRequest';
import Job from '../models/Job';
import { customerSchema, customerUpdateSchema } from '../validators';

export const createCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validation = customerSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: 'Validation error', errors: validation.error.flatten() });
    return;
  }

  const existingCustomer = await Customer.findOne({ email: validation.data.email });
  if (existingCustomer) {
    res.status(409).json({ message: 'Customer with this email already exists.' });
    return;
  }

  const customer = await Customer.create(validation.data);
  res.status(201).json({ message: 'Customer created.', customer });
};

export const getCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    search,
    page = '1',
    limit = '20',
  } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  let filter: Record<string, unknown> = { isActive: true };

  if (search) {
    filter = {
      ...filter,
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ],
    };
  }

  const [customers, total] = await Promise.all([
    Customer.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
    Customer.countDocuments(filter),
  ]);

  res.json({
    customers,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
};

export const getCustomerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404).json({ message: 'Customer not found.' });
    return;
  }
  res.json({ customer });
};

export const updateCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validation = customerUpdateSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: 'Validation error', errors: validation.error.flatten() });
    return;
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    validation.data,
    { new: true, runValidators: true }
  );

  if (!customer) {
    res.status(404).json({ message: 'Customer not found.' });
    return;
  }

  res.json({ message: 'Customer updated.', customer });
};

export const deleteCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!customer) {
    res.status(404).json({ message: 'Customer not found.' });
    return;
  }

  res.json({ message: 'Customer deactivated.' });
};

export const getCustomerServiceHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const jobs = await Job.find({ customerId: req.params.id } as any)
    .populate('serviceRequestId')
    .populate('technicianId', 'name email')
    .sort({ createdAt: -1 });

  res.json({ jobs });
};

export const getCustomerActiveRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  const requests = await ServiceRequest.find({
    customerId: req.params.id,
    status: { $ne: 'Closed' },
  } as any).sort({ createdAt: -1 });

  res.json({ requests });
};
