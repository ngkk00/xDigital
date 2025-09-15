import React, { useState } from 'react';
import type { Skill, CreateTaskRequest } from '../types';
import './TaskCreation.css'

interface SubtaskCreatorProps {
  skills: Skill[];
  onSubtasksChange: (subtasks: CreateTaskRequest[]) => void;
}

const SubtaskCreator: React.FC<SubtaskCreatorProps> = ({ skills, onSubtasksChange }) => {
  const [subtasks, setSubtasks] = useState<CreateTaskRequest[]>([]);
  const [title, setTitle] = useState('');
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);

  const handleAddSubtask = () => {
    if (!title.trim()) return;

    const newSubtask: CreateTaskRequest = {
      title: title.trim(),
      requiredSkillIds: selectedSkillIds.length > 0 ? selectedSkillIds : undefined,
      subtasks: [],
    };

    const updated = [...subtasks, newSubtask];
    setSubtasks(updated);
    onSubtasksChange(updated);

    setTitle('');
    setSelectedSkillIds([]);
  };

  const updateNestedSubtasks = (index: number, nested: CreateTaskRequest[]) => {
    const updated = [...subtasks];
    updated[index] = {
      ...updated[index],
      subtasks: nested,
    };
    setSubtasks(updated);
    onSubtasksChange(updated);
  };

  return (
    <div className="subtask-creator">
      <div className="create-subtask-form">

        <textarea
          value={title}
          placeholder="Subtask Component"
          onChange={(e) => setTitle(e.target.value)}
          className="subtask-input"
          rows={2} // you can adjust the number of rows
        />
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
                    setSelectedSkillIds((prev) =>
                      prev.filter((id) => id !== skill.id)
                    );
                  }
                }}
              />
              {skill.name}
            </label>
          ))}
        </div>

        {/* Add Subtask Button aligned right */}
        <div className="add-subtask-container">
          <button type="button" onClick={handleAddSubtask} className="add-subtask-btn">
            Add Subtask
          </button>
        </div>
      </div>

      {subtasks.length > 0 && (
        <ul className="subtask-list">
          {subtasks.map((subtask, index) => (
            <li key={index} className="subtask-item">
              <strong>{subtask.title}</strong>
              <SubtaskCreator
                skills={skills}
                onSubtasksChange={(nested) => updateNestedSubtasks(index, nested)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );

};

export default SubtaskCreator;
