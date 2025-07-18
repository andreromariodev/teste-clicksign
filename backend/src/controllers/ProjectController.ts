import { Request, Response } from 'express';
import ProjectService from '../services/ProjectService';
import { CreateProjectDto, UpdateProjectDto, ProjectFilters } from '../models/Project';

/**
 * @swagger
 * tags:
 *   - name: Projetos
 *     description: Operações relacionadas aos projetos
 *   - name: Histórico
 *     description: Operações relacionadas ao histórico de buscas
 */
class ProjectController {
  async getAllProjects(req: Request, res: Response): Promise<void> {
    try {
      const filters: ProjectFilters = {
        search: req.query.search as string,
        onlyFavorites: req.query.onlyFavorites === 'true',
        sortBy: req.query.sortBy as 'name' | 'startDate' | 'endDate',
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      const result = await ProjectService.getAllProjects(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await ProjectService.getProjectById(id);
      
      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const projectData: CreateProjectDto = req.body;
      
      // Validação básica
      if (!projectData.name || !projectData.client || !projectData.startDate || !projectData.endDate) {
        res.status(400).json({ error: 'Missing required fields: name, client, startDate, endDate' });
        return;
      }

      // Validação de datas
      const startDate = new Date(projectData.startDate);
      const endDate = new Date(projectData.endDate);
      
      if (startDate >= endDate) {
        res.status(400).json({ error: 'End date must be after start date' });
        return;
      }

      // Se tem arquivo de upload
      if (req.file) {
        projectData.coverImage = `/uploads/${req.file.filename}`;
      }

      const newProject = await ProjectService.createProject(projectData);
      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateProjectDto = req.body;

      // Se tem arquivo de upload
      if (req.file) {
        updateData.coverImage = `/uploads/${req.file.filename}`;
      }

      const updatedProject = await ProjectService.updateProject(id, updateData);
      
      if (!updatedProject) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      res.json(updatedProject);
    } catch (error) {
      // Tratar erros de validação específicos
      if (error instanceof Error && error.message.includes('Data final deve ser posterior')) {
        res.status(400).json({ error: error.message });
        return;
      }
      
      console.error('Erro no controller updateProject:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await ProjectService.deleteProject(id);
      
      if (!success) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async toggleFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedProject = await ProjectService.toggleFavorite(id);
      
      if (!updatedProject) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getSearchHistory(req: Request, res: Response): Promise<void> {
    try {
      const history = await ProjectService.getSearchHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new ProjectController();
