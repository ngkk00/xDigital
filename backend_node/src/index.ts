import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes/routes.js';
import { readFile } from 'fs/promises';
import { DatabaseService } from './services/database-service.js';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// ES module workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Point to the main folder xDigital
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
// Added so that return error is in json format, else html
app.use(express.json());

async function startServer() {
  try {
    // Load Swagger document
    const swaggerDocument = JSON.parse(
      await readFile(new URL('./docs/swagger.json', import.meta.url), 'utf-8')
    );

    // Initialize database
    await DatabaseService.initialize();
    await DatabaseService.seed();

    // Serve Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Health check route
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK', message: 'Server is running' });
    });

    // Register TSOA-generated routes LAST
    RegisterRoutes(app);
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err); // for debugging

      // Avoid sending HTML error response
      const status = err?.status || 500;
      const message = err?.message || 'Internal server error';

      res.status(status).json({ message });
    });
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();