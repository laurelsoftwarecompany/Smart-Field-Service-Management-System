import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { createServer } from 'http';
import 'express-async-errors';

import connectDB from './config/db';
import { initSocket } from './config/socket';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFound } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import technicianRoutes from './routes/technician.routes';
import serviceRequestRoutes from './routes/serviceRequest.routes';
import jobRoutes from './routes/job.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Swagger UI
const swaggerUi = require('swagger-ui-express');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health\n`);
  });
};

startServer();

export default app;
