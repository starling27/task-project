import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { ProjectService } from './modules/project/project.service.js';
import { EpicService } from './modules/epic/epic.service.js';
import { StoryService } from './modules/story/story.service.js';
import { UserService } from './modules/user/user.service.js';
import { WorkflowService } from './modules/workflow/workflow.service.js';
import { CommentService } from './modules/comment/comment.service.js';
import { HistoryService } from './modules/history/history.service.js';
import { AuthService } from './modules/auth/auth.service.js';

const fastify = Fastify({ logger: true });

// Register JWT
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'super-secret-key-123'
});

const projectService = new ProjectService();
const epicService = new EpicService();
const storyService = new StoryService();
const userService = new UserService();
const workflowService = new WorkflowService();
const commentService = new CommentService();
const historyService = new HistoryService();
const authService = new AuthService(fastify as any);

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
fastify.get('/api/v1/projects', async () => projectService.getAll());
fastify.get('/api/v1/projects/:id', async (req: any) => projectService.getById(req.params.id));
fastify.post('/api/v1/projects', async (req: any) => projectService.create(req.body));
fastify.put('/api/v1/projects/:id', async (req: any) => projectService.update(req.params.id, req.body));
fastify.delete('/api/v1/projects/:id', async (req: any) => projectService.delete(req.params.id));

// User Routes
fastify.get('/api/v1/users', async () => userService.getAll());
fastify.post('/api/v1/users', async (req: any) => userService.create(req.body));
fastify.delete('/api/v1/users/:id', async (req: any) => userService.delete(req.params.id));

// Epic Routes
fastify.get('/api/v1/epics/project/:projectId', async (req: any) => epicService.getByProject(req.params.projectId));
fastify.post('/api/v1/epics/:projectId', async (req: any) => epicService.create(req.params.projectId, req.body));
fastify.delete('/api/v1/epics/:id', async (req: any) => epicService.delete(req.params.id));

// Story Routes
fastify.get('/api/v1/stories', async () => storyService.getAll());
fastify.get('/api/v1/stories/project/:projectId', async (req: any) => storyService.getByProject(req.params.projectId));
fastify.post('/api/v1/stories', async (req: any) => storyService.create(req.body));
fastify.patch('/api/v1/stories/:id', async (req: any) => storyService.update(req.params.id, req.body));
fastify.delete('/api/v1/stories/:id', async (req: any) => storyService.delete(req.params.id));
fastify.patch('/api/v1/stories/:id/status', async (req: any) => storyService.update(req.params.id, req.body));
fastify.patch('/api/v1/stories/:id/assign', async (req: any) => storyService.update(req.params.id, req.body));

// Workflow Routes
fastify.get('/api/v1/workflow/states', async () => (workflowService as any).getAllStates()); // Fallback if no project
fastify.get('/api/v1/workflow/states/project/:projectId', async (req: any) => workflowService.getAllStates(req.params.projectId));
fastify.get('/api/v1/workflow/initial/project/:projectId', async (req: any) => workflowService.getInitialState(req.params.projectId));

// Workflow Configuration (per project)
fastify.get('/api/v1/projects/:projectId/workflow', async (req: any) => workflowService.listStates(req.params.projectId));
fastify.post('/api/v1/projects/:projectId/workflow', async (req: any) => workflowService.createState(req.params.projectId, req.body));
fastify.put('/api/v1/projects/:projectId/workflow/:id', async (req: any) => workflowService.updateState(req.params.projectId, req.params.id, req.body));
fastify.delete('/api/v1/projects/:projectId/workflow/:id', async (req: any) => workflowService.deleteState(req.params.projectId, req.params.id));

// Comment Routes
fastify.get('/api/v1/comments/story/:storyId', async (req: any) => commentService.getByStory(req.params.storyId));
fastify.post('/api/v1/comments', async (req: any) => commentService.create(req.body));

// History Routes
fastify.get('/api/v1/history/story/:storyId', async (req: any) => historyService.getFullStoryHistory(req.params.storyId));

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
