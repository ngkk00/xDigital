import React from 'react';
import type { Task, Developer } from '../types';

interface DeveloperAssignmentProps {
  task: Task;
  developers: Developer[];
  onAssign: (developerId: string) => void;
}

const DeveloperAssignment: React.FC<DeveloperAssignmentProps> = ({
  task,
  developers,
  onAssign
}) => {
  const eligibleDevelopers = developers.filter(developer =>
    task.requiredSkills.every(requiredSkill =>
      developer.skills.some(skill => skill.id === requiredSkill.id)
    )
  );

  return (
    <select
      value={task.assignedDeveloper?.id || ''}
      onChange={(e) => onAssign(e.target.value)}
      className="developer-dropdown"
    >
      <option value="">Assign Developer</option>
      {eligibleDevelopers.map(developer => (
        <option key={developer.id} value={developer.id}>
          {developer.name}
        </option>
      ))}
    </select>
  );
};

export default DeveloperAssignment;