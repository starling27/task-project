import 'dotenv/config';
import { PrismaProjectRepository } from '../src/modules/project/infrastructure/repositories/PrismaProjectRepository.js';
import { CreateProjectUseCase } from '../src/modules/project/application/use-cases/CreateProjectUseCase.js';
import { PrismaEpicRepository } from '../src/modules/epic/infrastructure/repositories/PrismaEpicRepository.js';
import { CreateEpicUseCase } from '../src/modules/epic/application/use-cases/CreateEpicUseCase.js';
import { PrismaStoryRepository } from '../src/modules/story/infrastructure/repositories/PrismaStoryRepository.js';
import { CreateStoryUseCase } from '../src/modules/story/application/use-cases/CreateStoryUseCase.js';
import { UpdateStoryUseCase } from '../src/modules/story/application/use-cases/UpdateStoryUseCase.js';
import { WorkflowService } from '../src/modules/workflow/workflow.service.js';
import { JiraSyncWorker } from '../src/workers/jiraSyncWorker.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Repositories
const projectRepository = new PrismaProjectRepository();
const epicRepository = new PrismaEpicRepository();
const storyRepository = new PrismaStoryRepository();
const workflowService = new WorkflowService();

// Use Cases
const createProjectUseCase = new CreateProjectUseCase(projectRepository);
const createEpicUseCase = new CreateEpicUseCase(epicRepository, projectRepository);
const createStoryUseCase = new CreateStoryUseCase(storyRepository, epicRepository, workflowService);
const updateStoryUseCase = new UpdateStoryUseCase(storyRepository, epicRepository, workflowService);

new JiraSyncWorker();

async function runE2ETest() {
  console.log("🚀 Iniciando Prueba de Integración E2E (Hexagonal)...");

  try {
    // 1. Crear Proyecto
    const project = await createProjectUseCase.execute({ 
      name: "Sistema de Sincronización Jira " + Date.now(), 
      description: "Prueba automatizada de flujo completo" 
    });
    console.log("✅ Proyecto creado:", project.name);

    // Crear segundo proyecto para validar reglas por projectId (workflow)
    const projectB = await createProjectUseCase.execute({
      name: "Proyecto B " + Date.now(),
      description: "Proyecto para validar workflow por projectId"
    });
    console.log("✅ Proyecto B creado:", projectB.name);

    // Agregar un estado exclusivo de Project B
    const exclusiveStateName = "blocked_b";
    await prisma.workflowState.create({
      data: {
        projectId: projectB.id,
        name: exclusiveStateName,
        order: 10,
        isInitial: false,
        isFinal: false,
        isDefault: false
      }
    });

    // 2. Crear Epic
    const epic = await createEpicUseCase.execute({ 
      projectId: project.id,
      name: "Integración MCP Core", 
      description: "Módulo principal de conexión" 
    });
    console.log("✅ Epic creada:", epic.name);

    // 3. Crear Story (Esto dispara el EventBus)
    const story = await createStoryUseCase.execute({
      epicId: epic.id,
      title: "Como usuario quiero sincronizar historias con Jira",
      description: "Se debe validar que el worker procese la cola",
      storyPoints: 5,
      priority: "high"
    });
    console.log("✅ Story creada e hilos de eventos disparados");

    // QA: No permitir usar un estado que no pertenezca al projectId de la story
    let invalidStatusAllowed = false;
    try {
      await updateStoryUseCase.execute({ id: story.id, status: exclusiveStateName });
      invalidStatusAllowed = true;
    } catch {
      // expected
    }
    if (invalidStatusAllowed) {
      throw new Error("❌ Error: se permitió asignar un status que pertenece a otro projectId");
    }
    console.log("✅ QA: el status exclusivo de otro proyecto fue rechazado");

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

    // 5. Verificar dueDate persistence
    const dueDate = "2024-12-31";
    const updatedStory = await updateStoryUseCase.execute({ id: story.id, dueDate });
    const receivedDueDate = updatedStory.dueDate?.toISOString().split('T')[0];
    if (receivedDueDate === dueDate) {
      console.log("✅ DueDate persistido correctamente:", receivedDueDate);
    } else {
      throw new Error(`❌ Error: dueDate no se persistió correctamente. Esperado: ${dueDate}, Recibido: ${receivedDueDate}`);
    }

    // 6. Crear Story con dueDate
    const storyWithDueDate = await createStoryUseCase.execute({
      epicId: epic.id,
      title: "Story with Due Date",
      description: "Testing creation with due date",
      dueDate: "2025-01-01"
    });
    const receivedDueDateCreated = storyWithDueDate.dueDate?.toISOString().split('T')[0];
    if (receivedDueDateCreated === "2025-01-01") {
      console.log("✅ Story creada con DueDate correctamente");
    } else {
      throw new Error("❌ Error: Story no se creó con DueDate correctamente");
    }

    console.log("\n✨ RESULTADO: FLUJO DE ENCOLADO Y DUE DATE EXITOSO (HEXAGONAL) ✨");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ FALLO EN LA PRUEBA:", error.message);
    process.exit(1);
  }
}

runE2ETest();
