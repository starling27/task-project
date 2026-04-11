import Fastify from 'fastify';
import { ProjectService } from './modules/project/project.service.js';
import { EpicService } from './modules/epic/epic.service.js';
import { StoryService } from './modules/story/story.service.js';
import { SprintService } from './modules/sprint/sprint.service.js';
import { UserService } from './modules/user/user.service.js';
import { WorkflowService } from './modules/workflow/workflow.service.js';
import { CommentService } from './modules/comment/comment.service.js';
import { HistoryService } from './modules/history/history.service.js';

const fastify = Fastify({ logger: true });
const projectService = new ProjectService();
const epicService = new EpicService();
const storyService = new StoryService();
const sprintService = new SprintService();
const userService = new UserService();
const workflowService = new WorkflowService();
const commentService = new CommentService();
const historyService = new HistoryService();

// Health Check
fastify.get('/api/v1/health', async () => ({ status: 'ok' }));

// Project Routes
fastify.get('/api/v1/projects', async () => projectService.getAll());
fastify.post('/api/v1/projects', async (req: any) => projectService.create(req.body));

// User Routes
fastify.get('/api/v1/users', async () => userService.getAll());
fastify.post('/api/v1/users', async (req: any) => userService.create(req.body));

// Epic Routes
fastify.get('/api/v1/epics/project/:projectId', async (req: any) => epicService.getByProject(req.params.projectId));
fastify.post('/api/v1/epics/:projectId', async (req: any) => epicService.create(req.params.projectId, req.body));

// Sprint Routes
fastify.get('/api/v1/sprints/project/:projectId', async (req: any) => sprintService.getByProject(req.params.projectId));
fastify.post('/api/v1/sprints', async (req: any) => sprintService.create(req.body));

// Story Routes
fastify.get('/api/v1/stories', async () => storyService.getAll());
fastify.get('/api/v1/stories/project/:projectId', async (req: any) => storyService.getByProject(req.params.projectId));
fastify.post('/api/v1/stories', async (req: any) => storyService.create(req.body));
fastify.patch('/api/v1/stories/:id', async (req: any) => storyService.update(req.params.id, req.body));
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
