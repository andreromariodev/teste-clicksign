import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import ProjectController from '../controllers/ProjectController';

const router = Router();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Aceitar apenas imagens
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Rotas
router.get('/projects', ProjectController.getAllProjects);
router.get('/projects/:id', ProjectController.getProjectById);
router.post('/projects', upload.single('coverImage'), ProjectController.createProject);
router.put('/projects/:id', upload.single('coverImage'), ProjectController.updateProject);
router.delete('/projects/:id', ProjectController.deleteProject);
router.patch('/projects/:id/favorite', ProjectController.toggleFavorite);

// Rotas para histórico de busca
router.get('/search-history', ProjectController.getSearchHistory);
router.delete('/search-history', ProjectController.clearSearchHistory);

export default router;
