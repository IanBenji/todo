'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Filter, ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { useSupabaseAuth, todoApi, supabase } from '@/lib/supabase';
import type { Todo } from '@/lib/supabase';

interface TodoWithUI extends Todo {
  expanded?: boolean;
}

export default function Home() {
  const { user, loading } = useSupabaseAuth();
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [tasks, setTasks] = useState<TodoWithUI[]>([]);
  const [filter, setFilter] = useState('all');

  // Fetch tasks when component mounts and user is authenticated
  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        try {
          const tasks = await todoApi.getAllTodos(user.id);
          setTasks(tasks.map(task => ({ ...task, expanded: false })));
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };
      fetchTasks();
    }
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTask.trim()) return;

    try {
      const newTodo = await todoApi.createTodo({
        user_id: user.id,
        title: newTask,
        description: newDescription.trim() || 'No description provided',
        is_complete: false,
      });

      setTasks([{ ...newTodo, expanded: false }, ...tasks]);
      setNewTask('');
      setNewDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;

      const updatedTodo = await todoApi.updateTodo(id, {
        is_complete: !taskToUpdate.is_complete
      });

      setTasks(tasks.map(task => 
        task.id === id ? { ...updatedTodo, expanded: task.expanded } : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await todoApi.deleteTodo(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleExpand = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, expanded: !task.expanded } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.is_complete;
    if (filter === 'completed') return task.is_complete;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Please sign in to manage your tasks</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Tasks</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {tasks.filter(t => !t.is_complete).length} tasks remaining
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </header>

        <form onSubmit={addTask} className="mb-8 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Add a description (optional)..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-20"
          />
        </form>

        <div className="mb-4 flex items-center gap-4">
          <Filter size={20} className="text-gray-500" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full ${
              filter === 'all' 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-full ${
              filter === 'active'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-full ${
              filter === 'completed'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="space-y-2">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    task.is_complete
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {task.is_complete && <Check size={16} className="text-white" />}
                </button>
                <div className="flex-1">
                  <span
                    className={`text-gray-900 dark:text-white ${
                      task.is_complete ? 'line-through text-gray-500 dark:text-gray-400' : ''
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => toggleExpand(task.id)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  {task.expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              {task.expanded && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {task.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}