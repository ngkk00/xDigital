export interface Skill {
  id: string;
  name: string;
}

export interface Developer {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Task {
  id: string;
  title: string;
  status: 'To-do' | 'Done';
  requiredSkills: Skill[];
  assignedDeveloper?: Developer;
  subtasks?: Task[];
  parentTask?: Task | null;
}

export interface CreateTaskRequest {
  title: string;
  requiredSkillIds?: string[];
  subtasks?: CreateTaskRequest[];
}