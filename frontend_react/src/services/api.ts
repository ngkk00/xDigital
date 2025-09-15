import axios from 'axios';
import type { Task, Developer, Skill, CreateTaskRequest } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  // Tasks
  getTasks: (): Promise<Task[]> => axios.get(`${API_BASE_URL}/tasks`).then(res => res.data),
  
  createTask: (task: CreateTaskRequest): Promise<Task> => {
    console.log(task)
    return axios.post(`${API_BASE_URL}/tasks`, task).then(res => res.data);
  },
  
  updateTaskStatus: (taskId: string, status: Task['status']): Promise<void> =>
    axios.patch(`${API_BASE_URL}/tasks/${taskId}/status`, { status }),
  
  assignDeveloper: (taskId: string, developerId: string): Promise<void> =>
    axios.post(`${API_BASE_URL}/tasks/assign`, { taskId, developerId }),

  // Developers
  getDevelopers: (): Promise<Developer[]> => 
    axios.get(`${API_BASE_URL}/developers`).then(res => res.data),

  // Skills
  getSkills: (): Promise<Skill[]> => 
    axios.get(`${API_BASE_URL}/skills`).then(res => res.data),
};