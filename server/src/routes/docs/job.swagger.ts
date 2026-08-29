/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a job (assign technician to service request)
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceRequestId, technicianId]
 *             properties:
 *               serviceRequestId:
 *                 type: string
 *               technicianId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created and technician assigned
 * 
 *   get:
 *     summary: List jobs with optional filters
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: technicianId
 *         schema:
 *           type: string
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of jobs
 * 
 * /jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details
 * 
 * /jobs/{id}/status:
 *   patch:
 *     summary: Update job status (triggers Socket.io broadcast)
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Assigned, Accepted, On The Way, In Progress, Completed, Unable to Complete, Customer Unavailable, Requires Follow-up]
 *     responses:
 *       200:
 *         description: Job status updated
 * 
 * /jobs/{id}/notes:
 *   post:
 *     summary: Add service note to a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnosis:
 *                 type: string
 *               workPerformed:
 *                 type: string
 *               partsUsed:
 *                 type: array
 *                 items:
 *                   type: string
 *               additionalNotes:
 *                 type: string
 *               followUp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service note added
 * 
 * /jobs/{id}/images:
 *   post:
 *     summary: Upload images to a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded
 */
export {};
