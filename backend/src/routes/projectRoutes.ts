import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import ProjectController from '../controllers/ProjectController';

const router = Router();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'coverImage-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Lista todos os projetos
 *     tags: [Projetos]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca para filtrar projetos por nome ou cliente
 *       - in: query
 *         name: onlyFavorites
 *         schema:
 *           type: boolean
 *         description: Filtrar apenas projetos favoritos
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, startDate, endDate]
 *         description: Campo para ordenação
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordem de classificação
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Número de itens por página
 *     responses:
 *       200:
 *         description: Lista de projetos com paginação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', ProjectController.getAllProjects);
router.get('/search-history', ProjectController.getSearchHistory);
router.get('/:id', ProjectController.getProjectById);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Cria um novo projeto
 *     tags: [Projetos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - client
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do projeto
 *               client:
 *                 type: string
 *                 description: Nome do cliente
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Data de início
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Data de término
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Imagem de capa do projeto
 *     responses:
 *       201:
 *         description: Projeto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', upload.single('coverImage'), ProjectController.createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Atualiza um projeto existente
 *     tags: [Projetos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do projeto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do projeto
 *               client:
 *                 type: string
 *                 description: Nome do cliente
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Data de início
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Data de término
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Nova imagem de capa do projeto
 *     responses:
 *       200:
 *         description: Projeto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Projeto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', upload.single('coverImage'), ProjectController.updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Remove um projeto
 *     tags: [Projetos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do projeto
 *     responses:
 *       204:
 *         description: Projeto removido com sucesso
 *       404:
 *         description: Projeto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', ProjectController.deleteProject);

/**
 * @swagger
 * /api/projects/{id}/favorite:
 *   patch:
 *     summary: Alterna o status de favorito de um projeto
 *     tags: [Projetos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do projeto
 *     responses:
 *       200:
 *         description: Status de favorito alterado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Projeto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/favorite', ProjectController.toggleFavorite);

/**
 * @swagger
 * /api/projects/search-history:
 *   get:
 *     summary: Obtém o histórico de buscas
 *     tags: [Histórico]
 *     responses:
 *       200:
 *         description: Histórico de buscas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["website", "mobile app", "redesign"]
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search-history', ProjectController.getSearchHistory);
router.post('/', upload.single('coverImage'), ProjectController.createProject);
router.put('/:id', upload.single('coverImage'), ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);
router.patch('/:id/favorite', ProjectController.toggleFavorite);

export default router;
