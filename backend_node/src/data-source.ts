import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import path from 'path';
import { Developer } from './entities/Developer.js';
import { Skill } from './entities/Skill.js';
import { Task } from './entities/Task.js';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'xdigital',
  synchronize: true,
  logging: true,
  entities: [Developer, Skill, Task],
  migrations: [path.join(__dirname, 'migrations/*.js')],
  subscribers: [],
});