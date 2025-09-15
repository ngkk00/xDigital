import { AppDataSource } from '../data-source.js';
import { Skill } from '../entities/Skill.js';
import { Developer } from '../entities/Developer.js';
import { Task } from '../entities/Task.js';
import { CreateTaskRequest } from '../types/request.js';
import { In } from 'typeorm';
import { LLMService } from './LLM-service.js';

export class DatabaseService {
  static async initialize() {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
  }

  static async seed() {
    console.log('Starting seed...');

    const queryRunner = AppDataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // Clear all data in correct order
      await queryRunner.query('DELETE FROM task_required_skills_skill');
      await queryRunner.query('DELETE FROM developer_skills_skill');
      await queryRunner.query('DELETE FROM task');
      await queryRunner.query('DELETE FROM developer');
      await queryRunner.query('DELETE FROM skill');

      // Create skills
      const frontend = await queryRunner.manager.save(Skill, { name: 'Frontend' });
      const backend = await queryRunner.manager.save(Skill, { name: 'Backend' });

      // Create developers with skills
      const alice = await queryRunner.manager.save(Developer, {
        name: 'Alice',
        skills: [frontend]
      });

      const bob = await queryRunner.manager.save(Developer, {
        name: 'Bob',
        skills: [backend]
      });

      const carol = await queryRunner.manager.save(Developer, {
        name: 'Carol',
        skills: [frontend, backend]
      });

      const dave = await queryRunner.manager.save(Developer, {
        name: 'Dave',
        skills: [backend]
      });

      // Create tasks
      await queryRunner.manager.save(Task, [
        {
          title: 'As a visitor, I want to see a responsive homepage so that I can easily navigate on both desktop and mobile devices.',
          status: 'To-do',
          requiredSkills: [frontend]
        },
        {
          title: 'Implement user authentication system with JWT tokens',
          status: 'To-do',
          requiredSkills: [backend]
        },
        {
          title: 'Create REST API endpoints for task management',
          status: 'To-do',
          requiredSkills: [backend]
        },
        {
          title: 'Design and implement database schema',
          status: 'Done',
          requiredSkills: [frontend, backend]
        }
      ]);

      await queryRunner.commitTransaction();
      console.log('Seed completed successfully!');

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  static async getDevelopers() {
    return AppDataSource.getRepository(Developer).find({
      relations: ['skills', 'tasks']
    });
  }

  static async getTasks() {
    return AppDataSource.getRepository(Task).find({
      relations: ['requiredSkills', 'assignedDeveloper', 'parentTask', 'subtasks']
    });
  }

  static async getSkills() {
    return AppDataSource.getRepository(Skill).find({
      relations: ['developers', 'tasks']
    });
  }

  static async createTask(title: string, skillIds: string[], subtasks?: CreateTaskRequest[], parentTask?: Task): Promise<Task> {
    const taskRepo = AppDataSource.getRepository(Task);
    const skillRepo = AppDataSource.getRepository(Skill);

    let skills: Skill[] = [];
    if (skillIds.length > 0) {
      // Use user-specified skills
      skills = await skillRepo.find({ where: { id: In(skillIds) } });
    } else {
      // No skills specified, call LLM to identify skills from title
      skills = await LLMService.identifySkillsFromTitle(title);
    }
    const task = taskRepo.create({
      title,
      status: 'To-do',
      requiredSkills: skills,
      parentTask: parentTask ?? null
    });
    const savedTask = await taskRepo.save(task);

    // For recusive create subtask
    if (subtasks && subtasks.length > 0) {
      for (const subtask of subtasks) {
        const subtaskSkillIds = subtask.requiredSkillIds ?? [];
        let subtaskSkills: Skill[] = [];

        if (subtaskSkillIds.length > 0) {
          subtaskSkills = await skillRepo.find({ where: { id: In(subtaskSkillIds) } });
        } else {
          // Use LLM for subtask too
          subtaskSkills = await LLMService.identifySkillsFromTitle(subtask.title);
        }
        await this.createTask(
          subtask.title,
           subtaskSkills.map((s) => s.id) ?? [],
          subtask.subtasks,
          savedTask
        )
      }
    }
    return await taskRepo.save(task);
  }

  static async assignTask(taskId: string, developerId: string): Promise<void> {
    const taskRepo = AppDataSource.getRepository(Task);
    const developerRepo = AppDataSource.getRepository(Developer);

    const task = await taskRepo.findOne({
      where: { id: taskId },
      relations: ['requiredSkills']
    });

    const developer = await developerRepo.findOne({
      where: { id: developerId },
      relations: ['skills']
    });

    if (!task || !developer) {
      throw new Error('Task or Developer not found');
    }

    // Check if developer has required skills
    const requiredSkillIds = task.requiredSkills.map(skill => skill.id);
    const developerSkillIds = developer.skills.map(skill => skill.id);

    const hasAllSkills = requiredSkillIds.every(skillId =>
      developerSkillIds.includes(skillId)
    );

    if (!hasAllSkills) {
      throw new Error('Developer does not have all required skills for this task');
    }

    task.assignedDeveloper = developer;
    await taskRepo.save(task);
  }

  static async unassignTask(taskId: string): Promise<void> {
    const taskRepo = AppDataSource.getRepository(Task);
    const task = await taskRepo.findOne({
      where: { id: taskId },
      relations: ['assignedDeveloper']
    });

    if (!task) {
      throw new Error('Task not found');
    }

    task.assignedDeveloper = null;
    await taskRepo.save(task);
  }

  static async updateTaskStatus(taskId: string, status: Task['status']): Promise<void> {
    const taskRepo = AppDataSource.getRepository(Task);
    const task = await taskRepo.findOne({
      where: { id: taskId },
      relations: ['subtasks', 'parentTask'],  // load subtasks
    });
    if (!task) {
      throw new Error('Task not found');
    }

    if (status === 'Done') {
      const allSubtasksDone = await this.isAllSubtasksDone(task.id)
      if (!allSubtasksDone) {
        throw new Error('Complete all subtasks first')
      }
    }

    task.status = status;
    await taskRepo.save(task);

    // If subtask set to To-do, and if ther is parent task then will change to To-do
    if (status !== 'Done' && task.parentTask) {
      await this.autoUpdateParentIfNeeded(task.parentTask.id)
    }
  }

  private static async isAllSubtasksDone(taskId: string): Promise<boolean> {
    const taskRepo = AppDataSource.getRepository(Task)
    const task = await taskRepo.findOne({
      where: { id: taskId },
      relations: ['subtasks']
    })
    if (!task || !task.subtasks || task.subtasks.length === 0) {
      // No subtask so return true
      return true;
    }
    for (const subtask of task.subtasks) {
      if (subtask.status !== 'Done') {
        return false;
      }
      const nestedDone = await this.isAllSubtasksDone(subtask.id)
      if (!nestedDone) {
        return false;
      }
    }

    return true;
  }

  private static async autoUpdateParentIfNeeded(taskId: string): Promise<void> {
    const taskRepo = AppDataSource.getRepository(Task);

    const task = await taskRepo.findOne({
      where: { id: taskId },
      relations: ['subtasks', 'parentTask'],
    });
    if (!task || task.status !== 'Done') return;

    const allSubtasksDone = await this.isAllSubtasksDone(task.id);
    if (!allSubtasksDone) {
      task.status = 'To-do';
      await taskRepo.save(task)
    }
    if (task.parentTask) {
      await this.autoUpdateParentIfNeeded(task.parentTask.id)
    }
  }
}


