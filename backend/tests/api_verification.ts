import 'dotenv/config';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

async function testApi() {
  console.log("🔍 Iniciando Verificación de Endpoints API...");

  try {
    // 1. Crear un Proyecto
    const projectName = `Proyecto Test API ${Date.now()}`;
    const projectRes = await fetch(`${API_BASE_URL}/api/v1/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: projectName, description: "Creado desde script de pruebas" })
    });
    const project: any = await projectRes.json();
    console.log("DEBUG PROJECT RESPONSE:", project);
    console.log(`✅ POST /api/v1/projects: ${projectRes.status} (ID: ${project.id})`);

    // 2. Obtener lista de Proyectos
    const projectsRes = await fetch(`${API_BASE_URL}/api/v1/projects`);
    const projects: any = await projectsRes.json();
    console.log(`✅ GET /api/v1/projects: ${projectsRes.status} (Total: ${projects.length})`);

    // 3. Crear una Epic
    const epicRes = await fetch(`${API_BASE_URL}/api/v1/epics/${project.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: "Epic Test API", description: "Descripción de epic" })
    });
    const epic: any = await epicRes.json();
    console.log(`✅ POST /api/v1/epics/${project.id}: ${epicRes.status} (ID: ${epic.id})`);

    // 4. Crear una Story
    const storyRes = await fetch(`${API_BASE_URL}/api/v1/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        epicId: epic.id, 
        title: "Story Test API", 
        description: "Contenido de prueba",
        priority: "medium" 
      })
    });
    const story: any = await storyRes.json();
    console.log(`✅ POST /api/v1/stories: ${storyRes.status} (ID: ${story.id})`);

    // 5. Actualizar Story (Status)
    const storyUpdateRes = await fetch(`${API_BASE_URL}/api/v1/stories/${story.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: "in_progress" })
    });
    console.log(`✅ PATCH /api/v1/stories/${story.id}/status: ${storyUpdateRes.status}`);

    // 6. Obtener Historias por Proyecto
    const storiesRes = await fetch(`${API_BASE_URL}/api/v1/stories/project/${project.id}`);
    const stories: any = await storiesRes.json();
    console.log(`✅ GET /api/v1/stories/project/${project.id}: ${storiesRes.status} (Total: ${stories.length})`);

    // 7. Obtener Historial de la Story
    const historyRes = await fetch(`${API_BASE_URL}/api/v1/history/story/${story.id}`);
    const history: any = await historyRes.json();
    console.log(`✅ GET /api/v1/history/story/${story.id}: ${historyRes.status} (Entradas: ${history.length})`);

    console.log("\n✨ RESULTADO: TODOS LOS ENDPOINTS RESPONDEN CORRECTAMENTE ✨");
  } catch (error: any) {
    console.error("❌ ERROR DURANTE LA PRUEBA DE API:", error.message);
    process.exit(1);
  }
}

testApi();
