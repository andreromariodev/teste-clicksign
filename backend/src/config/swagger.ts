import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gerenciador de Projetos API',
      version: '1.0.0',
      description: 'API para gerenciamento de projetos com upload de imagens, filtros, busca e favoritos',
      contact: {
        name: 'Andre Mario',
        email: 'andremario@example.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Project: {
          type: 'object',
          required: ['name', 'client', 'startDate', 'endDate'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do projeto'
            },
            name: {
              type: 'string',
              description: 'Nome do projeto',
              example: 'Website Redesign'
            },
            client: {
              type: 'string',
              description: 'Nome do cliente',
              example: 'Tech Corp'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Data de início do projeto',
              example: '2024-01-15'
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Data de término do projeto',
              example: '2024-03-15'
            },
            coverImage: {
              type: 'string',
              description: 'Caminho para a imagem de capa',
              example: '/uploads/cover-123456789.jpg'
            },
            isFavorite: {
              type: 'boolean',
              description: 'Indica se o projeto é favorito',
              example: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de última atualização'
            }
          }
        },
        CreateProjectDto: {
          type: 'object',
          required: ['name', 'client', 'startDate', 'endDate'],
          properties: {
            name: {
              type: 'string',
              description: 'Nome do projeto',
              example: 'Website Redesign'
            },
            client: {
              type: 'string',
              description: 'Nome do cliente',
              example: 'Tech Corp'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Data de início do projeto',
              example: '2024-01-15'
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Data de término do projeto',
              example: '2024-03-15'
            },
            coverImage: {
              type: 'string',
              description: 'Caminho para a imagem de capa (opcional)',
              example: '/uploads/cover-123456789.jpg'
            }
          }
        },
        UpdateProjectDto: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nome do projeto',
              example: 'Website Redesign v2'
            },
            client: {
              type: 'string',
              description: 'Nome do cliente',
              example: 'Tech Corp'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Data de início do projeto',
              example: '2024-01-15'
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Data de término do projeto',
              example: '2024-03-15'
            },
            coverImage: {
              type: 'string',
              description: 'Caminho para a imagem de capa',
              example: '/uploads/cover-123456789.jpg'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Project'
              }
            },
            total: {
              type: 'number',
              description: 'Total de projetos',
              example: 25
            },
            page: {
              type: 'number',
              description: 'Página atual',
              example: 1
            },
            totalPages: {
              type: 'number',
              description: 'Total de páginas',
              example: 3
            },
            hasNextPage: {
              type: 'boolean',
              description: 'Indica se há próxima página',
              example: true
            },
            hasPrevPage: {
              type: 'boolean',
              description: 'Indica se há página anterior',
              example: false
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Projeto não encontrado'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Caminhos para os arquivos com anotações
};

const specs = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Gerenciador de Projetos API',
  }));

  // Endpoint para obter a documentação em JSON
  app.get('/api-docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
}

export default specs;
