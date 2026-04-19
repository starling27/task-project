import 'dotenv/config';
import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';

// Repositories
import { PrismaProjectRepository } from './modules/project/infrastructure/repositories/PrismaProjectRepository.js';
import { PrismaEpicRepository } from './modules/epic/infrastructure/repositories/PrismaEpicRepository.js';
import { PrismaStoryRepository } from './modules/story/infrastructure/repositories/PrismaStoryRepository.js';
import { PrismaUserRepository } from './modules/user/infrastructure/repositories/PrismaUserRepository.js';
import { PrismaCommentRepository } from './modules/comment/infrastructure/repositories/PrismaCommentRepository.js';
import { PrismaWorkflowRepository } from './modules/workflow/infrastructure/repositories/PrismaWorkflowRepository.js';
import { PrismaHistoryRepository } from './modules/history/infrastructure/repositories/PrismaHistoryRepository.js';

// Use Cases
import { CreateProjectUseCase } from './modules/project/application/use-cases/CreateProjectUseCase.js';
import { GetAllProjectsUseCase } from './modules/project/application/use-cases/GetAllProjectsUseCase.js';
import { GetProjectByIdUseCase } from './modules/project/application/use-cases/GetProjectByIdUseCase.js';
import { UpdateProjectUseCase } from './modules/project/application/use-cases/UpdateProjectUseCase.js';
import { DeleteProjectUseCase } from './modules/project/application/use-cases/DeleteProjectUseCase.js';

import { CreateEpicUseCase } from './modules/epic/application/use-cases/CreateEpicUseCase.js';
import { GetEpicsByProjectUseCase } from './modules/epic/application/use-cases/GetEpicsByProjectUseCase.js';
import { GetEpicByIdUseCase } from './modules/epic/application/use-cases/GetEpicByIdUseCase.js';
import { UpdateEpicUseCase } from './modules/epic/application/use-cases/UpdateEpicUseCase.js';
import { DeleteEpicUseCase } from './modules/epic/application/use-cases/DeleteEpicUseCase.js';

import { CreateStoryUseCase } from './modules/story/application/use-cases/CreateStoryUseCase.js';
import { UpdateStoryUseCase } from './modules/story/application/use-cases/UpdateStoryUseCase.js';
import { GetStoriesByProjectUseCase } from './modules/story/application/use-cases/GetStoriesByProjectUseCase.js';
import { DeleteStoryUseCase } from './modules/story/application/use-cases/DeleteStoryUseCase.js';

import { RegisterWithProviderUseCase } from './modules/user/application/use-cases/RegisterWithProviderUseCase.js';
import { GetAllUsersUseCase } from './modules/user/application/use-cases/GetAllUsersUseCase.js';

import { CreateCommentUseCase } from './modules/comment/application/use-cases/CreateCommentUseCase.js';
import { GetCommentsByStoryUseCase } from './modules/comment/application/use-cases/GetCommentsByStoryUseCase.js';

import { GetWorkflowStatesUseCase } from './modules/workflow/application/use-cases/GetWorkflowStatesUseCase.js';
import { CreateWorkflowStateUseCase } from './modules/workflow/application/use-cases/CreateWorkflowStateUseCase.js';

import { GetFullStoryHistoryUseCase } from './modules/history/application/use-cases/GetFullStoryHistoryUseCase.js';

// Services
import { WorkflowService } from './modules/workflow/workflow.service.js';
import { ReportService } from './modules/report/report.service.js';
import { AuthService } from './modules/auth/auth.service.js';

const fastify = Fastify({ logger: true });

// Register JWT
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'super-secret-key-123'
});

// Repository Instances
const projectRepository = new PrismaProjectRepository();
const epicRepository = new PrismaEpicRepository();
const storyRepository = new PrismaStoryRepository();
const userRepository = new PrismaUserRepository();
const commentRepository = new PrismaCommentRepository();
const workflowRepository = new PrismaWorkflowRepository();
const historyRepository = new PrismaHistoryRepository();

// Use Case Instances
const createProjectUseCase = new CreateProjectUseCase(projectRepository);
const getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepository);
const getProjectByIdUseCase = new GetProjectByIdUseCase(projectRepository);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);
const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository);

const createEpicUseCase = new CreateEpicUseCase(epicRepository, projectRepository);
const getEpicsByProjectUseCase = new GetEpicsByProjectUseCase(epicRepository);
const getEpicByIdUseCase = new GetEpicByIdUseCase(epicRepository);
const updateEpicUseCase = new UpdateEpicUseCase(epicRepository);
const deleteEpicUseCase = new DeleteEpicUseCase(epicRepository);

const workflowService = new WorkflowService();
const createStoryUseCase = new CreateStoryUseCase(storyRepository, epicRepository, workflowService);
const updateStoryUseCase = new UpdateStoryUseCase(storyRepository, epicRepository, workflowService);
const getStoriesByProjectUseCase = new GetStoriesByProjectUseCase(storyRepository);
const deleteStoryUseCase = new DeleteStoryUseCase(storyRepository);

const registerWithProviderUseCase = new RegisterWithProviderUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

const createCommentUseCase = new CreateCommentUseCase(commentRepository);
const getCommentsByStoryUseCase = new GetCommentsByStoryUseCase(commentRepository);

const getWorkflowStatesUseCase = new GetWorkflowStatesUseCase(workflowRepository);
const createWorkflowStateUseCase = new CreateWorkflowStateUseCase(workflowRepository);

const getFullStoryHistoryUseCase = new GetFullStoryHistoryUseCase(historyRepository);

// Service Instances
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
  if (!code) return reply.status(400).send({ error: 'Code is required' });

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
    return reply.status(500).send({ error: error.message });
  }
});

fastify.post('/api/v1/auth/logout', async () => ({ success: true, message: 'Logged out successfully' }));

fastify.post('/api/v1/auth/google/register', async (req: any, reply) => {
  const { email, name, provider, providerId, avatarUrl } = req.body;
  if (!email || !provider || !providerId) return reply.status(400).send({ error: 'Missing required fields' });

  try {
    const user = await registerWithProviderUseCase.execute({ email, name, provider, providerId, avatarUrl });
    const token = fastify.jwt.sign({ id: user.id, email: user.email, role: user.role }, { expiresIn: '1h' });
    return { token, user };
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

// Epic Routes
fastify.get('/api/v1/epics/project/:projectId', async (req: any) => getEpicsByProjectUseCase.execute(req.params.projectId));
fastify.get('/api/v1/epics/:id', async (req: any, reply) => {
  try {
    const epic = await getEpicByIdUseCase.execute(req.params.id);
    return epic;
  } catch (error: any) {
    if (error.message === 'Epic not found') return reply.status(404).send({ error: error.message });
    throw error;
  }
});
fastify.post('/api/v1/epics/:projectId', async (req: any, reply) => {
  try {
    const epic = await createEpicUseCase.execute({ projectId: req.params.projectId, ...req.body });
    return epic;
  } catch (error: any) {
    if (error.message === 'Project does not exist') {
      return reply.status(404).send({ error: 'The specified project could not be found.' });
    }
    if (error.message === 'Epic name must be unique within project' || error.code === 'P2002') {
      return reply.status(409).send({ error: 'An epic with this name already exists in the project.' });
    }
    // Re-throw other errors to be handled by a generic error handler if available
    throw error;
  }
});
fastify.patch('/api/v1/epics/:id', async (req: any, reply) => {
  try {
    const epic = await updateEpicUseCase.execute({ id: req.params.id, ...req.body });
    return epic;
  } catch (error: any) {
    if (error.message === 'Epic not found') return reply.status(404).send({ error: error.message });
    if (error.message === 'Archived epics cannot be updated') return reply.status(403).send({ error: error.message });
    if (error.message === 'Epic name must be unique within project') return reply.status(409).send({ error: error.message });
    throw error;
  }
});
fastify.delete('/api/v1/epics/:id', async (req: any) => deleteEpicUseCase.execute(req.params.id));

// Story Routes
fastify.get('/api/v1/stories/project/:projectId', async (req: any) => getStoriesByProjectUseCase.execute(req.params.projectId));
fastify.post('/api/v1/stories', async (req: any) => createStoryUseCase.execute(req.body));
fastify.patch('/api/v1/stories/:id', async (req: any) => updateStoryUseCase.execute({ id: req.params.id, ...req.body }));
fastify.patch('/api/v1/stories/:id/status', async (req: any) => updateStoryUseCase.execute({ id: req.params.id, ...req.body }));
fastify.delete('/api/v1/stories/:id', async (req: any) => deleteStoryUseCase.execute(req.params.id));

// User Routes
fastify.get('/api/v1/users', async () => getAllUsersUseCase.execute());

// Workflow Routes
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
