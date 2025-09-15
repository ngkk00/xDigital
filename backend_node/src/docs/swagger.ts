import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import fs from 'fs';
import path from 'path';

// Use default export instead of named export
export function setupSwagger(app: Express): void {
  try {
    const swaggerDocument = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8')
    );

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('Swagger docs available at http://localhost:3001/api-docs');
  } catch (error) {
    console.error('Failed to setup Swagger:', error);
  }
}