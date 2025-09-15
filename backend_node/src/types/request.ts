export interface CreateTaskRequest {
  title: string;
  requiredSkillIds?: string[];
  subtasks?: CreateTaskRequest[];
  parentTaskId?: string;
}

export interface UpdateTaskStatusRequest {
  status: 'To-do' | 'In Progress' | 'Done';
}

export interface AssignDeveloperRequest {
  taskId: string;
  developerId: string;
}

export interface AnalyzeSkillsRequest {
  title: string;
}

export interface BatchAnalyzeSkillsRequest {
  titles: string[];
}