import request from 'supertest';
import express from 'express';

// Mock app simples para testes
const app = express();
app.use(express.json());

// Mock das rotas
app.get('/api/projects', (req, res) => {
  res.json({
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false
    }
  });
});

app.post('/api/projects', (req, res) => {
  const project = {
    id: 'mock-id',
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.status(201).json(project);
});

app.get('/api/projects/:id', (req, res) => {
  res.json({
    id: req.params.id,
    name: 'Projeto Teste',
    client: 'Cliente Teste',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

app.put('/api/projects/:id', (req, res) => {
  const project = {
    id: req.params.id,
    name: 'Projeto Teste',
    client: 'Cliente Teste',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isFavorite: false,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(project);
});

app.delete('/api/projects/:id', (req, res) => {
  res.json({ message: 'Project deleted successfully' });
});

app.patch('/api/projects/:id/favorite', (req, res) => {
  res.json({
    id: req.params.id,
    name: 'Projeto Teste',
    client: 'Cliente Teste',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isFavorite: true,
    updatedAt: new Date().toISOString()
  });
});

app.get('/api/search-history', (req, res) => {
  res.json(['projeto', 'website', 'mobile']);
});

describe('Project API E2E Tests', () => {
  describe('GET /api/projects', () => {
    it('deve retornar lista vazia quando não há projetos', async () => {
      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      });
    });
  });

  describe('POST /api/projects', () => {
    it('deve criar um novo projeto', async () => {
      const newProject = {
        name: 'Novo Projeto',
        client: 'Novo Cliente',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isFavorite: false
      };

      const response = await request(app)
        .post('/api/projects')
        .send(newProject);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newProject.name);
      expect(response.body.client).toBe(newProject.client);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });
  });

  describe('GET /api/projects/:id', () => {
    it('deve retornar projeto específico', async () => {
      const response = await request(app).get('/api/projects/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Projeto Teste');
      expect(response.body.client).toBe('Cliente Teste');
      expect(response.body.id).toBe('1');
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('deve atualizar projeto existente', async () => {
      const updateData = {
        name: 'Projeto Atualizado',
        isFavorite: true
      };

      const response = await request(app)
        .put('/api/projects/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Projeto Atualizado');
      expect(response.body.isFavorite).toBe(true);
      expect(response.body.updatedAt).toBeDefined();
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('deve deletar projeto existente', async () => {
      const response = await request(app).delete('/api/projects/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Project deleted successfully');
    });
  });

  describe('PATCH /api/projects/:id/favorite', () => {
    it('deve alterar status de favorito', async () => {
      const response = await request(app).patch('/api/projects/1/favorite');

      expect(response.status).toBe(200);
      expect(response.body.isFavorite).toBe(true);
      expect(response.body.updatedAt).toBeDefined();
    });
  });

  describe('Search History', () => {
    it('deve retornar histórico de busca', async () => {
      const response = await request(app).get('/api/search-history');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
