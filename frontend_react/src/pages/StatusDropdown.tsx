import React from 'react';
import type { Task } from '../types';

interface StatusDropdownProps {
  status: Task['status'];
  onStatusChange: (status: Task['status']) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ status, onStatusChange }) => {
  const statuses: Task['status'][] = ['To-do', 'Done'];

  return (
    <select 
      value={status} 
      onChange={(e) => onStatusChange(e.target.value as Task['status'])}
      className="status-dropdown"
    >
      {statuses.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
};

export default StatusDropdown;