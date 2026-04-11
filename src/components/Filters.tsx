import React from 'react';

interface FiltersProps {
  status: string;
  priority: string;
  assignee: string;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onAssigneeChange: (assignee: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  status, priority, assignee, 
  onStatusChange, onPriorityChange, onAssigneeChange
}) => {
  return (
    <div className="flex gap-4 p-4 bg-gray-100 rounded">
      <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="">All Statuses</option>
        <option value="unassigned">Unassigned</option>
        <option value="assigned">Assigned</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select value={priority} onChange={(e) => onPriorityChange(e.target.value)}>
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
      <input 
        type="text" 
        placeholder="Assignee ID" 
        value={assignee} 
        onChange={(e) => onAssigneeChange(e.target.value)} 
      />
    </div>
  );
};
