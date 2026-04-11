import React from 'react';
import { useBacklogStore } from '../store/useBacklogStore';

interface AssigneeSelectorProps {
  storyId: string;
  currentAssigneeId?: string;
}

export const AssigneeSelector: React.FC<AssigneeSelectorProps> = ({ storyId, currentAssigneeId }) => {
  const { users, updateStory } = useBacklogStore();

  const handleSelect = (userId: string) => {
    updateStory(storyId, { assigneeId: userId });
  };

  const selectedUser = users.find(u => u.id === currentAssigneeId);

  return (
    <div className="relative group/selector" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-3 border-l pl-6 border-gray-100 cursor-pointer">
        <span className="text-xs font-medium text-gray-500 hidden sm:block">
          {selectedUser ? selectedUser.name : 'Unassigned'}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform hover:scale-110 ${selectedUser ? 'bg-indigo-500' : 'bg-gray-300'}`}>
          {selectedUser ? selectedUser.name.charAt(0).toUpperCase() : '?'}
        </div>
      </div>
      
      {/* Mini dropdown on hover (CSS based or simple JS) */}
      <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover/selector:opacity-100 group-hover/selector:visible transition-all z-30 p-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase p-2 tracking-widest border-b mb-1">Assign to</p>
        <div className="max-h-40 overflow-y-auto">
          {users.map(user => (
            <div 
              key={user.id}
              onClick={() => handleSelect(user.id)}
              className={`p-2 rounded-lg text-xs cursor-pointer hover:bg-indigo-50 transition-colors ${user.id === currentAssigneeId ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600'}`}
            >
              {user.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
