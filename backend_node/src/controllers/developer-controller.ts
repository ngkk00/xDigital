import { Request, Response } from 'express';
import { DatabaseService } from '../services/database-service.js';
import { 
  Controller, 
  Get, 
  Route, 
  Tags 
} from 'tsoa';

@Route('developers')
@Tags('Developers')
export class DeveloperController {
  @Get()
  public async getDevelopers(): Promise<any[]> {
    return DatabaseService.getDevelopers();
  }
}