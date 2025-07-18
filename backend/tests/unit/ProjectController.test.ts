import request from 'supertest';
import express from 'express';
import projectController from '../../src/controllers/ProjectController';
import ProjectService from '../../src/services/ProjectService';

// Mock do ProjectService
jest.mock('../../src/services/ProjectService');
const MockedProjectService = ProjectService as jest.Mocked<typeof ProjectService>;

// Setup da aplicação Express para teste
const app = express();
app.use(express.json());

// Setup das rotas para teste
app.get('/projects', projectController.getAllProjects.bind(projectController));
app.get('/projects/:id', projectController.getProjectById.bind(projectController));
app.post('/projects', projectController.createProject.bind(projectController));
app.put('/projects/:id', projectController.updateProject.bind(projectController));
app.delete('/projects/:id', projectController.deleteProject.bind(projectController));
app.patch('/projects/:id/favorite', projectController.toggleFavorite.bind(projectController));
app.get('/search-history', projectController.getSearchHistory.bind(projectController));

describe('ProjectController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /projects', () => {
    it('deve retornar lista de projetos', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            name: 'Projeto Teste',
            client: 'Cliente Teste',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            isFavorite: false,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      };

      MockedProjectService.getAllProjects.mockResolvedValue(mockResponse);

      const response = await request(app).get('/projects');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    it('deve aplicar filtros de busca', async () => {
      const mockResponse = {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      };

      MockedProjectService.getAllProjects.mockResolvedValue(mockResponse);

      await request(app)
        .get('/projects')
        .query({
          search: 'teste',
          onlyFavorites: 'true',
          sortBy: 'name',
          sortOrder: 'asc',
          page: '1',
          limit: '5'
        });

      expect(MockedProjectService.getAllProjects).toHaveBeenCalledWith({
        search: 'teste',
        onlyFavorites: true,
        sortBy: 'name',
        sortOrder: 'asc',
        page: 1,
        limit: 5
      });
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      MockedProjectService.getAllProjects.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/projects');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('GET /projects/:id', () => {
    it('deve retornar projeto por ID', async () => {
      const mockProject = {
        id: '1',
        name: 'Projeto Teste',
        client: 'Cliente Teste',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isFavorite: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };

      MockedProjectService.getProjectById.mockResolvedValue(mockProject);

      const response = await request(app).get('/projects/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProject);
    });

    it('deve retornar 404 quando projeto não existe', async () => {
      MockedProjectService.getProjectById.mockResolvedValue(null);

      const response = await request(app).get('/projects/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Project not found' });
    });
  });

  describe('POST /projects', () => {
    it('deve criar um novo projeto', async () => {
      const newProject = {
        name: 'Novo Projeto',
        client: 'Novo Cliente',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isFavorite: false
      };

      const createdProject = {
        id: '1',
        ...newProject,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };

      MockedProjectService.createProject.mockResolvedValue(createdProject);

      const response = await request(app)
        .post('/projects')
        .send(newProject);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdProject);
    });

    it('deve retornar 400 para dados inválidos', async () => {
      const incompleteProject = {
        name: 'Projeto Incompleto'
        // client, startDate, endDate faltando
      };

      const response = await request(app)
        .post('/projects')
        .send(incompleteProject);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields: name, client, startDate, endDate' });
    });
  });

  describe('PUT /projects/:id', () => {
    it('deve atualizar um projeto existente', async () => {
      const updateData = {
        name: 'Projeto Atualizado',
        isFavorite: true
      };

      const updatedProject = {
        id: '1',
        name: 'Projeto Atualizado',
        client: 'Cliente Teste',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isFavorite: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };

      MockedProjectService.updateProject.mockResolvedValue(updatedProject);

      const response = await request(app)
        .put('/projects/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedProject);
    });

    it('deve retornar 404 quando projeto não existe', async () => {
      MockedProjectService.updateProject.mockResolvedValue(null);

      const response = await request(app)
        .put('/projects/999')
        .send({ name: 'Projeto Atualizado' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Project not found' });
    });
  });

  describe('DELETE /projects/:id', () => {
    it('deve deletar um projeto', async () => {
      MockedProjectService.deleteProject.mockResolvedValue(true);

      const response = await request(app).delete('/projects/1');

      expect(response.status).toBe(204);
    });

    it('deve retornar 404 quando projeto não existe', async () => {
      MockedProjectService.deleteProject.mockResolvedValue(false);

      const response = await request(app).delete('/projects/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Project not found' });
    });
  });

  describe('PATCH /projects/:id/favorite', () => {
    it('deve alterar status de favorito', async () => {
      const updatedProject = {
        id: '1',
        name: 'Projeto Teste',
        client: 'Cliente Teste',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isFavorite: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };

      MockedProjectService.toggleFavorite.mockResolvedValue(updatedProject);

      const response = await request(app).patch('/projects/1/favorite');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedProject);
    });

    it('deve retornar 404 quando projeto não existe', async () => {
      MockedProjectService.toggleFavorite.mockResolvedValue(null);

      const response = await request(app).patch('/projects/999/favorite');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Project not found' });
    });
  });
});
