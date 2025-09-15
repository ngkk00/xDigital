import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { Skill } from './Skill.js';
import { Developer } from './Developer.js';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  title!: string;

  @Column({
    type: 'enum',
    enum: ['Done', 'To-do'],
    default: 'To-do'
  })
  status!: string;

  @ManyToMany(() => Skill, skill => skill.tasks)
  @JoinTable()
  requiredSkills!: Skill[];

  @ManyToOne(() => Developer, developer => developer.tasks, { nullable: true })
  assignedDeveloper!: Developer | null;

  // One task can help manuy subtask, and cascade changes down
  @OneToMany(() => Task, task => task.parentTask, { cascade: true })
  subtasks?: Task[];

  // Many subtask point to one parent and if parent delete, subtask will be deleted
  @ManyToOne(() => Task, task => task.subtasks, { nullable: true, onDelete: 'CASCADE' })
  parentTask!: Task | null;

}