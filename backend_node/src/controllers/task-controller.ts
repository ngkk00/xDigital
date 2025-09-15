import { Controller, Get, Post, Route, Tags, Body, Path, Patch } from 'tsoa';
import { DatabaseService } from '../services/database-service.js';
import { Task } from '../entities/Task';
import type { 
  CreateTaskRequest, 
  UpdateTaskStatusRequest, 
  AssignDeveloperRequest,
  AnalyzeSkillsRequest,
  BatchAnalyzeSkillsRequest
} from '../types/request.js';

@Route('tasks')
@Tags('Tasks')
export class TaskController {
  @Get()
  public async getTasks(): Promise<Task[]> {
    return DatabaseService.getTasks();
  }

  @Post()
  public async createTask(@Body() body: CreateTaskRequest): Promise<Task> {
    return DatabaseService.createTask(body.title, body.requiredSkillIds ?? [], body.subtasks);
  }

  @Post('assign')
  public async assignTask(@Body() body: { taskId: string; developerId: string }): Promise<{ message: string }> {
    await DatabaseService.assignTask(body.taskId, body.developerId);
    return { message: 'Task assigned successfully' };
  }

  @Post('{taskId}/unassign')
  public async unassignTask(@Path() taskId: string): Promise<{ message: string }> {
    await DatabaseService.unassignTask(taskId);
    return { message: 'Task unassigned successfully' };
  }

  @Patch('{taskId}/status')
  public async updateTaskStatus(
    @Path() taskId: string,
    @Body() body: {status: Task['status']}): Promise<{message: string}> {
      await DatabaseService.updateTaskStatus(taskId, body.status);
      return {message: 'Task status update successfully'};
  }
}

