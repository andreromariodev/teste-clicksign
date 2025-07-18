import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/database';
import projectRoutes from './routes/projectRoutes';
import ProjectService from './services/ProjectService';
import { setupSwagger } from './config/swagger';

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar ao MongoDB
const startServer = async () => {
  try {
    await connectDB();
    
    // Middlewares
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Configurar Swagger
    setupSwagger(app);

    // Servir arquivos estáticos (uploads)
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // Rotas
    app.use('/api', projectRoutes);

    // Rota de health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        database: 'connected',
        timestamp: new Date().toISOString() 
      });
    });

    // Rota de documentação
    app.get('/', (req, res) => {
      res.redirect('/api-docs');
    });

    // Middleware de tratamento de erros
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large' });
      }
      
      if (err.message === 'Only image files are allowed!') {
        return res.status(400).json({ error: 'Only image files are allowed' });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    });

    // Rota 404
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Seed inicial de dados
    await ProjectService.seedProjects();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`💚 Health check at http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Iniciar o servidor
startServer();
