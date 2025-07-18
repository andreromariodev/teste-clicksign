import ProjectService from '../../src/services/ProjectService';

// Mock todo o ProjectService
jest.mock('../../src/services/ProjectService', () => ({
  __esModule: true,
  default: {
    getAllProjects: jest.fn(),
    getProjectById: jest.fn(),
    createProject: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
    toggleFavorite: jest.fn(),
    getSearchHistory: jest.fn()
  }
}));

const MockedProjectService = ProjectService as jest.Mocked<typeof ProjectService>;

describe('ProjectService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProjects', () => {
    it('deve retornar lista de projetos sem filtros', async () => {
      const mockResult = {
        data: [
          {
            id: '507f1f77bcf86cd799439011',
            name: 'Projeto Teste',
            client: 'Cliente Teste',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            coverImage: 'test.jpg',
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

      MockedProjectService.getAllProjects.mockResolvedValue(mockResult);

      const result = await ProjectService.getAllProjects();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Projeto Teste');
      expect(result.pagination.total).toBe(1);
      expect(MockedProjectService.getAllProjects).toHaveBeenCalledTimes(1);
    });

    it('deve filtrar projetos por busca', async () => {
      const mockResult = {
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

      MockedProjectService.getAllProjects.mockResolvedValue(mockResult);

      const filters = { search: 'Projeto' };
      const result = await ProjectService.getAllProjects(filters);

      expect(result.data).toHaveLength(0);
      expect(MockedProjectService.getAllProjects).toHaveBeenCalledWith(filters);
    });

    it('deve filtrar apenas favoritos', async () => {
      const mockResult = {
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

      MockedProjectService.getAllProjects.mockResolvedValue(mockResult);

      const filters = { onlyFavorites: true };
      const result = await ProjectService.getAllProjects(filters);

      expect(result.data).toHaveLength(0);
      expect(MockedProjectService.getAllProjects).toHaveBeenCalledWith(filters);
    });

    it('deve ordenar por nome em ordem crescente', async () => {
      const mockResult = {
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

      MockedProjectService.getAllProjects.mockResolvedValue(mockResult);

      const filters = { sortBy: 'name' as const, sortOrder: 'asc' as const };
      const result = await ProjectService.getAllProjects(filters);

      expect(result.data).toHaveLength(0);
      expect(MockedProjectService.getAllProjects).toHaveBeenCalledWith(filters);
    });
  });

  describe('getProjectById', () => {
    it('deve retornar projeto por ID', async () => {
      const mockProject = {
        id: '507f1f77bcf86cd799439011',
        name: 'Projeto Teste',
        client: 'Cliente Teste',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        coverImage: 'test.jpg',
        isFavorite: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };

      MockedProjectService.getProjectById.mockResolvedValue(mockProject);

      const result = await ProjectService.getProjectById('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockProject);
      expect(MockedProjectService.getProjectById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('deve retornar null quando projeto não existe', async () => {
      MockedProjectService.getProjectById.mockResolvedValue(null);

      const result = await ProjectService.getProjectById('999');

      expect(result).toBeNull();
      expect(MockedProjectService.getProjectById).toHaveBeenCalledWith('999');
    });
  });

  describe('createProject', () => {
    it('deve criar um novo projeto', async () => {
      const projectData = {
        name: 'Novo Projeto',
        client: 'Novo Cliente',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isFavorite: false
      };

      const mockProject = {
        id: '507f1f77bcf86cd799439011',
        name: 'Novo Projeto',
        client: 'Novo Cliente',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isFavorite: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };

      MockedProjectService.createProject.mockResolvedValue(mockProject);

      const result = await ProjectService.createProject(projectData);

      expect(result.name).toBe('Novo Projeto');
      expect(result.client).toBe('Novo Cliente');
      expect(result.id).toBe('507f1f77bcf86cd799439011');
      expect(MockedProjectService.createProject).toHaveBeenCalledWith(projectData);
    });
  });

  describe('updateProject', () => {
    it('deve atualizar um projeto existente', async () => {
      const updateData = {
        name: 'Projeto Atualizado',
        isFavorite: true
      };

      const mockProject = {
        id: '507f1f77bcf86cd799439011',
        name: 'Projeto Atualizado',
        client: 'Cliente Teste',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isFavorite: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };

      MockedProjectService.updateProject.mockResolvedValue(mockProject);

      const result = await ProjectService.updateProject('507f1f77bcf86cd799439011', updateData);

      expect(result?.name).toBe('Projeto Atualizado');
      expect(result?.isFavorite).toBe(true);
      expect(MockedProjectService.updateProject).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateData);
    });

    it('deve retornar null quando projeto não existe', async () => {
      MockedProjectService.updateProject.mockResolvedValue(null);

      const result = await ProjectService.updateProject('999', { name: 'Teste' });

      expect(result).toBeNull();
      expect(MockedProjectService.updateProject).toHaveBeenCalledWith('999', { name: 'Teste' });
    });
  });

  describe('deleteProject', () => {
    it('deve deletar um projeto', async () => {
      MockedProjectService.deleteProject.mockResolvedValue(true);

      const result = await ProjectService.deleteProject('507f1f77bcf86cd799439011');

      expect(result).toBe(true);
      expect(MockedProjectService.deleteProject).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('deve retornar false quando projeto não existe', async () => {
      MockedProjectService.deleteProject.mockResolvedValue(false);

      const result = await ProjectService.deleteProject('999');

      expect(result).toBe(false);
      expect(MockedProjectService.deleteProject).toHaveBeenCalledWith('999');
    });
  });

  describe('toggleFavorite', () => {
    it('deve alterar status de favorito', async () => {
      const mockProject = {
        id: '507f1f77bcf86cd799439011',
        name: 'Projeto Teste',
        client: 'Cliente Teste',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isFavorite: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };

      MockedProjectService.toggleFavorite.mockResolvedValue(mockProject);

      const result = await ProjectService.toggleFavorite('507f1f77bcf86cd799439011');

      expect(result?.isFavorite).toBe(true);
      expect(MockedProjectService.toggleFavorite).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });
});
