import Fastify from 'fastify';
import { ProjectService } from './modules/project/project.service.js';
import { EpicService } from './modules/epic/epic.service.js';
import { StoryService } from './modules/story/story.service.js';

const fastify = Fastify({ logger: true });
const projectService = new ProjectService();
const epicService = new EpicService();
const storyService = new StoryService();

// Health Check
fastify.get('/api/v1/health', async () => ({ status: 'ok' }));

// Project Routes
fastify.get('/api/v1/projects', async () => projectService.getAll());
fastify.post('/api/v1/projects', async (req: any) => projectService.create(req.body));

// Epic Routes
fastify.get('/api/v1/epics/project/:projectId', async (req: any) => epicService.getByProject(req.params.projectId));
fastify.post('/api/v1/epics/:projectId', async (req: any) => epicService.create(req.params.projectId, req.body));

// Story Routes
fastify.get('/api/v1/stories', async () => storyService.getAll());
fastify.post('/api/v1/stories', async (req: any) => storyService.create(req.body));
fastify.patch('/api/v1/stories/:id/status', async (req: any) => storyService.update(req.params.id, req.body));
fastify.patch('/api/v1/stories/:id/assign', async (req: any) => storyService.update(req.params.id, req.body));

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
