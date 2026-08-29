import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Field Service Management System API',
      version: '1.0.0',
      description:
        'API documentation for the Smart Field Service Management System — manages customers, technicians, service requests, and jobs.',
      contact: {
        name: 'Laurel Software Company',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/**/*.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
