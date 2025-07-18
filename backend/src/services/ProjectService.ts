import { ProjectModel, IProject } from '../models/ProjectModel';
import { SearchHistoryModel } from '../models/SearchHistoryModel';
import { Project, CreateProjectDto, UpdateProjectDto, ProjectFilters, PaginatedResponse } from '../models/Project';

class ProjectService {
  // Converter IProject (Mongoose) para Project (interface)
  private convertToProject(doc: IProject): Project {
    return {
      id: (doc._id as any).toString(),
      name: doc.name,
      client: doc.client,
      startDate: doc.startDate.toISOString().split('T')[0],
      endDate: doc.endDate.toISOString().split('T')[0],
      coverImage: doc.coverImage || undefined,
      isFavorite: doc.isFavorite,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString()
    };
  }

  async getAllProjects(filters: ProjectFilters = {}): Promise<PaginatedResponse<Project>> {
    try {
      // Construir query
      const query: any = {};

      // Filtro de busca
      if (filters.search && filters.search.length >= 3) {
        const searchRegex = new RegExp(filters.search, 'i');
        query.$or = [
          { name: searchRegex },
          { client: searchRegex }
        ];
      }

      // Filtro de favoritos
      if (filters.onlyFavorites) {
        query.isFavorite = true;
      }

      // Configurar ordenação
      let sortOptions: any = {};
      if (filters.sortBy) {
        const sortField = filters.sortBy === 'name' ? 'name' : 
                         filters.sortBy === 'startDate' ? 'startDate' : 'endDate';
        sortOptions[sortField] = filters.sortOrder === 'desc' ? -1 : 1;
      } else {
        sortOptions.name = 1; // Ordenação padrão por nome
      }

      // Paginação
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      // Executar queries em paralelo
      const [projects, total] = await Promise.all([
        ProjectModel.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .exec(),
        ProjectModel.countDocuments(query)
      ]);

      // Converter para interface Project
      const convertedProjects = projects.map(doc => this.convertToProject(doc));

      const totalPages = Math.ceil(total / limit);

      return {
        data: convertedProjects,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      throw new Error('Erro interno do servidor');
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    try {
      const project = await ProjectModel.findById(id).exec();
      return project ? this.convertToProject(project) : null;
    } catch (error) {
      console.error('Erro ao buscar projeto por ID:', error);
      return null;
    }
  }

  async createProject(projectData: CreateProjectDto): Promise<Project> {
    try {
      const newProject = new ProjectModel({
        name: projectData.name,
        client: projectData.client,
        startDate: new Date(projectData.startDate),
        endDate: new Date(projectData.endDate),
        coverImage: projectData.coverImage,
        isFavorite: projectData.isFavorite || false
      });

      const savedProject = await newProject.save();
      return this.convertToProject(savedProject);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw new Error('Erro ao criar projeto');
    }
  }

  async updateProject(id: string, updateData: UpdateProjectDto): Promise<Project | null> {
    try {
      // Buscar o projeto existente para validação
      const existingProject = await ProjectModel.findById(id).exec();
      if (!existingProject) {
        return null;
      }

      const updateObject: any = { ...updateData };
      
      // Converter datas se necessário
      if (updateData.startDate) {
        updateObject.startDate = new Date(updateData.startDate);
      }
      if (updateData.endDate) {
        updateObject.endDate = new Date(updateData.endDate);
      }

      // Validação de datas
      const finalStartDate = updateObject.startDate || existingProject.startDate;
      const finalEndDate = updateObject.endDate || existingProject.endDate;

      if (finalEndDate <= finalStartDate) {
        throw new Error('Data final deve ser posterior à data de início');
      }

      const updatedProject = await ProjectModel.findByIdAndUpdate(
        id, 
        updateObject, 
        { new: true, runValidators: false } // Desabilitar validadores automáticos
      ).exec();

      return updatedProject ? this.convertToProject(updatedProject) : null;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      
      if (error instanceof Error && error.message.includes('Data final deve ser posterior')) {
        throw error; // Re-throw validation errors
      }
      
      throw new Error('Erro ao atualizar projeto');
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const result = await ProjectModel.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      return false;
    }
  }

  async toggleFavorite(id: string): Promise<Project | null> {
    try {
      const project = await ProjectModel.findById(id).exec();
      if (!project) return null;

      project.isFavorite = !project.isFavorite;
      const updatedProject = await project.save();
      
      return this.convertToProject(updatedProject);
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      return null;
    }
  }

  // Métodos para histórico de busca
  async getSearchHistory(): Promise<string[]> {
    try {
      const history = await SearchHistoryModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .exec();
      
      return history.map(h => h.term);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
  }

  // Seed inicial de projetos
  async seedProjects(): Promise<void> {
    try {
      const existingCount = await ProjectModel.countDocuments();
      
      if (existingCount === 0) {
        const sampleProjects: CreateProjectDto[] = [
          {
            name: "Website Redesign",
            client: "Tech Corp",
            startDate: "2024-01-15",
            endDate: "2024-03-15"
          },
          {
            name: "Mobile App Development",
            client: "StartupXYZ",
            startDate: "2024-02-01",
            endDate: "2024-06-01"
          },
          {
            name: "E-commerce Platform",
            client: "Retail Store",
            startDate: "2024-01-01",
            endDate: "2024-04-30"
          },
          {
            name: "Sistema de Gestão",
            client: "Empresa ABC",
            startDate: "2024-03-01",
            endDate: "2024-08-31"
          },
          {
            name: "API Rest Completa",
            client: "Tech Solutions",
            startDate: "2024-02-15",
            endDate: "2024-05-15"
          }
        ];

        for (const project of sampleProjects) {
          await this.createProject(project);
        }

        console.log('✅ Projetos de exemplo criados');
      }
    } catch (error) {
      console.error('Erro ao criar projetos de exemplo:', error);
    }
  }
}

export default new ProjectService();
