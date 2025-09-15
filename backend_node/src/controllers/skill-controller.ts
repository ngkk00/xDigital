import { DatabaseService } from '../services/database-service.js';
import {
    Controller,
    Get,
    Route,
    Tags
} from 'tsoa';

@Route('skills')
@Tags('Skills')
export class SkillController {
    @Get()
    public async getSkills(): Promise<any[]> {
        return DatabaseService.getSkills();
    }
}