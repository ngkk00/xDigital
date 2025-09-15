import React, { useState } from 'react';
import type { Skill, CreateTaskRequest } from '../types';
import { api } from '../services/api';
import SubtaskCreator from './SubTaskCreator';

interface TaskCreationProps {
  skills: Skill[];
  onTaskCreated: () => void;
}

const TaskCreation: React.FC<TaskCreationProps> = ({ skills, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<CreateTaskRequest[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsCreating(true);
    try {
      await api.createTask({
        title: title.trim(),
        requiredSkillIds: selectedSkillIds.length > 0 ? selectedSkillIds : undefined,
        subtasks: subtasks.length > 0 ? subtasks : undefined,
      });

      // Reset form
      setTitle('');
      setSelectedSkillIds([]);
      setSubtasks([]);
      onTaskCreated();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="task-creation">
      <h2>Create Task(s)</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New Task Component"
            rows={2}
            required
          />
        </div>

        <div className="form-group">
          <label>Required Skills (optional):</label>
          <div className="skills-checkbox">
            {skills.map((skill) => (
              <label key={skill.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedSkillIds.includes(skill.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSkillIds((prev) => [...prev, skill.id]);
                    } else {
                      setSelectedSkillIds((prev) => prev.filter((id) => id !== skill.id));
                    }
                  }}
                />
                {skill.name}
              </label>
            ))}
          </div>
        </div>

        <SubtaskCreator skills={skills} onSubtasksChange={setSubtasks} />

        <div className="form-actions">
          <button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreation;
