import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
