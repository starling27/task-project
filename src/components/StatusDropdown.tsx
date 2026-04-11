import React from 'react';
import { useBacklogStore } from '../store/useBacklogStore';

interface StatusDropdownProps {
  storyId: string;
  currentStatus: string;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ storyId, currentStatus }) => {
  const { workflowStates, updateStory } = useBacklogStore();

  return (
    <select
      value={currentStatus}
      onChange={(e) => updateStory(storyId, { status: e.target.value })}
      className="text-xs font-semibold px-3 py-1 rounded-full shadow-sm bg-indigo-100 text-indigo-700 border-none outline-none cursor-pointer hover:bg-indigo-200 transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      {workflowStates.map((state) => (
        <option key={state.id} value={state.name}>
          {state.name.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </option>
      ))}
    </select>
  );
};
