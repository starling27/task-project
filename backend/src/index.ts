import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { PrismaProjectRepository } from './modules/project/infrastructure/repositories/PrismaProjectRepository.js';
import { CreateProjectUseCase } from './modules/project/application/use-cases/CreateProjectUseCase.js';
import { GetAllProjectsUseCase } from './modules/project/application/use-cases/GetAllProjectsUseCase.js';
import { GetProjectByIdUseCase } from './modules/project/application/use-cases/GetProjectByIdUseCase.js';
import { UpdateProjectUseCase } from './modules/project/application/use-cases/UpdateProjectUseCase.js';
import { DeleteProjectUseCase } from './modules/project/application/use-cases/DeleteProjectUseCase.js';

import { PrismaEpicRepository } from './modules/epic/infrastructure/repositories/PrismaEpicRepository.js';
import { CreateEpicUseCase } from './modules/epic/application/use-cases/CreateEpicUseCase.js';
import { GetEpicsByProjectUseCase } from './modules/epic/application/use-cases/GetEpicsByProjectUseCase.js';
import { DeleteEpicUseCase } from './modules/epic/application/use-cases/DeleteEpicUseCase.js';

import { PrismaStoryRepository } from './modules/story/infrastructure/repositories/PrismaStoryRepository.js';
import { CreateStoryUseCase } from './modules/story/application/use-cases/CreateStoryUseCase.js';
import { UpdateStoryUseCase } from './modules/story/application/use-cases/UpdateStoryUseCase.js';
import { GetStoriesByProjectUseCase } from './modules/story/application/use-cases/GetStoriesByProjectUseCase.js';
import { DeleteStoryUseCase } from './modules/story/application/use-cases/DeleteStoryUseCase.js';

import { PrismaUserRepository } from './modules/user/infrastructure/repositories/PrismaUserRepository.js';
import { RegisterWithProviderUseCase } from './modules/user/application/use-cases/RegisterWithProviderUseCase.js';
import { GetAllUsersUseCase } from './modules/user/application/use-cases/GetAllUsersUseCase.js';

import { PrismaCommentRepository } from './modules/comment/infrastructure/repositories/PrismaCommentRepository.js';
import { CreateCommentUseCase } from './modules/comment/application/use-cases/CreateCommentUseCase.js';
import { GetCommentsByStoryUseCase } from './modules/comment/application/use-cases/GetCommentsByStoryUseCase.js';

import { PrismaWorkflowRepository } from './modules/workflow/infrastructure/repositories/PrismaWorkflowRepository.js';
import { GetWorkflowStatesUseCase } from './modules/workflow/application/use-cases/GetWorkflowStatesUseCase.js';
import { CreateWorkflowStateUseCase } from './modules/workflow/application/use-cases/CreateWorkflowStateUseCase.js';

import { PrismaHistoryRepository } from './modules/history/infrastructure/repositories/PrismaHistoryRepository.js';
import { GetFullStoryHistoryUseCase } from './modules/history/application/use-cases/GetFullStoryHistoryUseCase.js';

import { WorkflowService } from './modules/workflow/workflow.service.js';
import { HistoryService } from './modules/history/history.service.js';
import { AuthService } from './modules/auth/auth.service.js';
import { ReportService } from './modules/report/report.service.js';
import { UserService } from './modules/user/user.service.js'; // Keep legacy for now if needed

const fastify = Fastify({ logger: true });

// Register JWT
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'super-secret-key-123'
});

// Hexagonal Project Module
const projectRepository = new PrismaProjectRepository();
const createProjectUseCase = new CreateProjectUseCase(projectRepository);
const getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepository);
const getProjectByIdUseCase = new GetProjectByIdUseCase(projectRepository);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);
const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository);

// Hexagonal Epic Module
const epicRepository = new PrismaEpicRepository();
const createEpicUseCase = new CreateEpicUseCase(epicRepository, projectRepository);
const getEpicsByProjectUseCase = new GetEpicsByProjectUseCase(epicRepository);
const deleteEpicUseCase = new DeleteEpicUseCase(epicRepository);

// Hexagonal Workflow Module
const workflowRepository = new PrismaWorkflowRepository();
const getWorkflowStatesUseCase = new GetWorkflowStatesUseCase(workflowRepository);
const createWorkflowStateUseCase = new CreateWorkflowStateUseCase(workflowRepository);

// Hexagonal Story Module
const storyRepository = new PrismaStoryRepository();
const workflowService = new WorkflowService();
const createStoryUseCase = new CreateStoryUseCase(storyRepository, epicRepository, workflowService);
const updateStoryUseCase = new UpdateStoryUseCase(storyRepository, epicRepository, workflowService);
const getStoriesByProjectUseCase = new GetStoriesByProjectUseCase(storyRepository);
const deleteStoryUseCase = new DeleteStoryUseCase(storyRepository);

// Hexagonal User Module
const userRepository = new PrismaUserRepository();
const registerWithProviderUseCase = new RegisterWithProviderUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

// Hexagonal Comment Module
const commentRepository = new PrismaCommentRepository();
const createCommentUseCase = new CreateCommentUseCase(commentRepository);
const getCommentsByStoryUseCase = new GetCommentsByStoryUseCase(commentRepository);

// Hexagonal History Module
const historyRepository = new PrismaHistoryRepository();
const getFullStoryHistoryUseCase = new GetFullStoryHistoryUseCase(historyRepository);

const userService = new UserService(); // Still used in some routes
const historyService = new HistoryService();
const authService = new AuthService(fastify as any, userRepository);
const reportService = new ReportService();

// Health Check
fastify.get('/api/v1/health', async () => ({ status: 'ok' }));

// Auth Routes
fastify.get('/api/v1/auth/google', async (req, reply) => {
  const url = authService.getGoogleAuthUrl();
  return reply.redirect(url);
});

fastify.get('/api/v1/auth/google/callback', async (req: any, reply) => {
  const { code } = req.query;
  if (!code) {
    return reply.status(400).send({ error: 'Code is required' });
  }

  try {
    const result = await authService.googleCallback(code);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    if ((result as any).partialSuccess) {
      const partialUserJson = encodeURIComponent(JSON.stringify(result));
      return reply.redirect(`${frontendUrl}/?partialUser=${partialUserJson}`);
    }
    
    const token = (result as any).token;
    const userJson = encodeURIComponent(JSON.stringify((result as any).user));
    return reply.redirect(`${frontendUrl}/?token=${token}&user=${userJson}`);
  } catch (error: any) {
    fastify.log.error(error);
    return reply.status(500).send({ error: error.message });
  }
});

fastify.post('/api/v1/auth/logout', async (req, reply) => {
  // Since we use sessionStorage on frontend, we don't need to do much on backend
  // but we can return a success message.
  return { success: true, message: 'Logged out successfully' };
});

fastify.post('/api/v1/auth/google/register', async (req: any, reply) => {
  const { email, name, provider, providerId, avatarUrl } = req.body;
  if (!email || !provider || !providerId) {
    return reply.status(400).send({ error: 'Missing required fields' });
  }

  try {
    const user = await userService.registerWithProvider({ email, name, provider, providerId, avatarUrl });
    const token = fastify.jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: '1h' }
    );
    return { token, user };
  } catch (error: any) {
    fastify.log.error(error);
    return reply.status(500).send({ error: error.message });
  }
});

fastify.patch('/api/v1/users/me/email', async (req: any, reply) => {
  // Normally we would verify JWT here
  try {
    const { email, userId } = req.body; // Simulating me
    if (!email || !userId) return reply.status(400).send({ error: 'Missing fields' });
    
    // Check if user exists and update
    const user = await userService.getById(userId);
    if (!user) return reply.status(404).send({ error: 'User not found' });
    
    const updated = await (userService as any).updateEmail(userId, email);
    return updated;
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
});

// Project Routes
fastify.get('/api/v1/projects', async () => getAllProjectsUseCase.execute());
fastify.get('/api/v1/projects/:id', async (req: any) => getProjectByIdUseCase.execute(req.params.id));
fastify.post('/api/v1/projects', async (req: any) => createProjectUseCase.execute(req.body));
fastify.put('/api/v1/projects/:id', async (req: any) => updateProjectUseCase.execute({ id: req.params.id, ...req.body }));
fastify.delete('/api/v1/projects/:id', async (req: any) => deleteProjectUseCase.execute(req.params.id));

// User Routes
fastify.get('/api/v1/users', async () => getAllUsersUseCase.execute());
fastify.post('/api/v1/auth/google/register', async (req: any, reply) => {
  const { email, name, provider, providerId, avatarUrl } = req.body;
  if (!email || !provider || !providerId) {
    return reply.status(400).send({ error: 'Missing required fields' });
  }

  try {
    const user = await registerWithProviderUseCase.execute({ email, name, provider, providerId, avatarUrl });
    const token = fastify.jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: '1h' }
    );
    return { token, user };
  } catch (error: any) {
    fastify.log.error(error);
    return reply.status(500).send({ error: error.message });
  }
});

// Workflow Routes
fastify.get('/api/v1/workflow/states', async () => { throw new Error('Project ID required'); });
fastify.get('/api/v1/workflow/states/project/:projectId', async (req: any) => getWorkflowStatesUseCase.execute(req.params.projectId));

// Workflow Configuration (per project)
fastify.get('/api/v1/projects/:projectId/workflow', async (req: any) => getWorkflowStatesUseCase.execute(req.params.projectId));
fastify.post('/api/v1/projects/:projectId/workflow', async (req: any) => createWorkflowStateUseCase.execute({ projectId: req.params.projectId, ...req.body }));

// Comment Routes
fastify.get('/api/v1/comments/story/:storyId', async (req: any) => getCommentsByStoryUseCase.execute(req.params.storyId));
fastify.post('/api/v1/comments', async (req: any) => createCommentUseCase.execute(req.body));

// History Routes
fastify.get('/api/v1/history/story/:storyId', async (req: any) => getFullStoryHistoryUseCase.execute(req.params.storyId));

// Report Routes
fastify.get('/api/v1/reports/project/:projectId', async (req: any, reply) => {
  try {
    const csv = await reportService.generateProjectBacklogCSV(req.params.projectId);
    reply.header('Content-Type', 'text/csv');
    reply.header('Content-Disposition', `attachment; filename=backlog-${req.params.projectId}.csv`);
    return csv;
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Backend Server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
