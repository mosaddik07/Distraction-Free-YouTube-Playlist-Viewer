import React, { useState } from 'react';
import { Key } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

export const ApiKeyInput: React.FC = () => {
  const { state, dispatch } = useApp();
  const [apiKey, setApiKey] = useState(state.config.youtubeApiKey || '');
  const [isEditing, setIsEditing] = useState(!state.config.youtubeApiKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    dispatch({ type: 'SET_API_KEY', payload: apiKey.trim() });
    setIsEditing(false);
    toast.success('API key saved successfully!');
  };

  if (!isEditing && state.config.youtubeApiKey) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-300">
        <Key size={16} />
        <span>API Key configured</span>
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-400 hover:text-blue-300"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex space-x-2">
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter YouTube API Key"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Save
        </button>
      </div>
    </form>
  );
};