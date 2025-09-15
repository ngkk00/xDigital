import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Developer } from './Developer.js';
import { Task } from './Task.js';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { unique: true })
  name!: string;

  @ManyToMany(() => Developer, developer => developer.skills)
  developers!: Developer[];

  @ManyToMany(() => Task, task => task.requiredSkills)
  tasks!: Task[];
}