import React, { useEffect, useState } from 'react';
import { useBacklogStore, Comment as CommentType } from '../store/useBacklogStore';

interface CommentSectionProps {
  storyId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ storyId }) => {
  const { fetchComments, addComment } = useBacklogStore();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    const data = await fetchComments(storyId);
    setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, [storyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    await addComment(storyId, newComment);
    setNewComment('');
    await loadComments();
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b pb-2">Discussion</h4>
      
      <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 shrink-0">
              {comment.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-gray-700">{comment.user.name}</span>
                <span className="text-[9px] text-gray-400 font-medium">
                  {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && <p className="text-xs text-gray-400 italic py-4 text-center">No comments yet. Start the discussion!</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
        <button 
          disabled={loading}
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};
