import { ProjectService } from '../src/modules/project/project.service.js';
import { EpicService } from '../src/modules/epic/epic.service.js';
import { StoryService } from '../src/modules/story/story.service.js';
import { JiraSyncWorker } from '../src/workers/jiraSyncWorker.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const projectService = new ProjectService();
const epicService = new EpicService();
const storyService = new StoryService();
new JiraSyncWorker();

async function runE2ETest() {
  console.log("🚀 Iniciando Prueba de Integración E2E...");

  try {
    // 1. Crear Proyecto
    const project = await projectService.create({ 
      name: "Sistema de Sincronización Jira " + Date.now(), 
      description: "Prueba automatizada de flujo completo" 
    });
    console.log("✅ Proyecto creado:", project.name);

    // 2. Crear Epic
    const epic = await epicService.create(project.id, { 
      name: "Integración MCP Core", 
      description: "Módulo principal de conexión" 
    });
    console.log("✅ Epic creada:", epic.name);

    // 3. Crear Story (Esto dispara el EventBus)
    const story = await storyService.create({
      epicId: epic.id,
      title: "Como usuario quiero sincronizar historias con Jira",
      description: "Se debe validar que el worker procese la cola",
      storyPoints: 5,
      priority: "high"
    });
    console.log("✅ Story creada e hilos de eventos disparados");

    // Esperar a que la persistencia asíncrona ocurra
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 4. Verificar Cola de Sincronización
    const queuedTasks = await prisma.jiraSyncQueue.findMany({
      where: { storyId: story.id },
      orderBy: { createdAt: 'desc' }
    });

    if (queuedTasks.length === 1) {
      console.log("✅ Se encoló exactamente una tarea en JiraSyncQueue (Estado: " + queuedTasks[0].status + ")");
    } else {
      throw new Error("❌ Error: cantidad de tareas inesperada en JiraSyncQueue para la historia creada");
    }

    console.log("\n✨ RESULTADO: FLUJO DE ENCOLADO EXITOSO ✨");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ FALLO EN LA PRUEBA:", error.message);
    process.exit(1);
  }
}

runE2ETest();
