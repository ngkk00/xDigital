import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Skill } from './Skill.js';
import { Task } from './Task.js';

@Entity()
export class Developer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  name!: string;

  @ManyToMany(() => Skill, skill => skill.developers)
  @JoinTable()
  skills!: Skill[];

  @OneToMany(() => Task, task => task.assignedDeveloper)
  tasks!: Task[];
}