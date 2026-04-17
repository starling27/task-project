import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportService {
  /**
   * Genera un contenido CSV con el backlog de un proyecto específico.
   * @param projectId ID del proyecto
   */
  async generateProjectBacklogCSV(projectId: string): Promise<string> {
    const stories = await prisma.story.findMany({
      where: {
        deletedAt: null,
        epic: {
          projectId: projectId
        }
      },
      include: {
        assignee: true,
        epic: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const headers = ['Título', 'Estado', 'Responsable', 'Puntos', 'Prioridad', 'Fecha de Vencimiento', 'Épica'];
    
    const rows = stories.map(story => [
      story.title,
      story.status,
      story.assignee?.name || 'Sin asignar',
      story.storyPoints?.toString() || '0',
      story.priority,
      story.dueDate ? story.dueDate.toISOString().split('T')[0] : '',
      story.epic?.name || ''
    ]);

    // Formateo manual CSV con escapado de comillas dobles
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    return csvContent;
  }
}
