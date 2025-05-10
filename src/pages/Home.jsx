import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

// Define icon components
const CheckCircleIcon = getIcon('CheckCircle');
const ClockIcon = getIcon('Clock');
const BarChart2Icon = getIcon('BarChart2');
const ListTodoIcon = getIcon('ListTodo');

export default function Home() {
  // Sample initial tasks for the MVP
  const initialTasks = [
    {
      id: '1',
      title: 'Review project proposal',
      description: 'Go through the new client project proposal and provide feedback',
      status: 'In Progress',
      priority: 'High',
      dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      createdAt: new Date(),
      tags: ['work', 'client']
    },
    {
      id: '2',
      title: 'Prepare weekly report',
      description: 'Compile data and prepare the weekly progress report',
      status: 'Not Started',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 86400000 * 1), // 1 day from now
      createdAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
      tags: ['work', 'report']
    },
    {
      id: '3',
      title: 'Buy groceries',
      description: 'Get milk, eggs, bread, and vegetables',
      status: 'Completed',
      priority: 'Low',
      dueDate: new Date(Date.now() - 86400000 * 1), // 1 day ago
      createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      tags: ['personal', 'shopping']
    }
  ];

  const [tasks, setTasks] = useState(() => {
    // Try to load tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks, (key, value) => {
      // Convert date strings back to Date objects
      if (key === 'dueDate' || key === 'createdAt') {
        return new Date(value);
      }
      return value;
    }) : initialTasks;
  });

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  useEffect(() => {
    // Save tasks to localStorage whenever they change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Calculate task statistics
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const notStartedTasks = tasks.filter(task => task.status === 'Not Started').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Add a new task to the list
  const addTask = (newTask) => {
    const taskWithId = { 
      ...newTask, 
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTasks([...tasks, taskWithId]);
    toast.success("Task added successfully!");
  };

  // Update the status of a task
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    toast.info(`Task marked as ${newStatus}`);
  };

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.error("Task deleted");
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.status === 'Completed';
    if (filter === 'active') return task.status !== 'Completed';
    if (filter === 'high') return task.priority === 'High';
    if (filter === 'medium') return task.priority === 'Medium';
    if (filter === 'low') return task.priority === 'Low';
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Priority badge color mapping
  const priorityColors = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  };

  // Status badge color mapping
  const statusColors = {
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Not Started': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  };

  // Format a date in a readable format
  const formatDate = (date) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Animation variants for list items
  const taskItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <motion.h1 
          className="text-3xl sm:text-4xl font-bold mb-2 text-center md:text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Task Dashboard
        </motion.h1>
        <motion.p 
          className="text-surface-600 dark:text-surface-400 text-center md:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Organize, prioritize, and complete your tasks efficiently
        </motion.p>
      </div>

      {/* Dashboard stats */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="card p-4 flex items-center gap-4 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-light/10 to-primary/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          <div className="relative z-10 flex items-center justify-between w-full">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Total Tasks</p>
              <p className="text-2xl font-bold">{totalTasks}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <ListTodoIcon size={24} />
            </div>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-green-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          <div className="relative z-10 flex items-center justify-between w-full">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Completed</p>
              <p className="text-2xl font-bold">{completedTasks}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
              <CheckCircleIcon size={24} />
            </div>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-blue-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          <div className="relative z-10 flex items-center justify-between w-full">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">In Progress</p>
              <p className="text-2xl font-bold">{inProgressTasks}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
              <ClockIcon size={24} />
            </div>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-purple-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          <div className="relative z-10 flex items-center justify-between w-full">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Completion Rate</p>
              <p className="text-2xl font-bold">{completionRate}%</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
              <BarChart2Icon size={24} />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task management interface */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="card p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold">Your Tasks</h2>
              
              <div className="flex flex-wrap gap-2">
                <select 
                  className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Tasks</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                
                <select 
                  className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="dueDate">Sort by Due Date</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>
            </div>
            
            {sortedTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-surface-500 dark:text-surface-400">No tasks match your filters</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                <AnimatePresence>
                  {sortedTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      custom={index}
                      variants={taskItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`task-card relative ${task.status === 'Completed' ? 'opacity-70' : ''}`}
                      layout
                    >
                      <div className="flex justify-between">
                        <h3 className={`font-medium text-lg ${task.status === 'Completed' ? 'line-through text-surface-500' : ''}`}>
                          {task.title}
                        </h3>
                        <div className="flex space-x-2">
                          <span className={`priority-badge ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                          <span className={`priority-badge ${statusColors[task.status]}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="mt-2 text-surface-600 dark:text-surface-400 text-sm">
                        {task.description}
                      </p>
                      
                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          {task.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-700">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-surface-500 dark:text-surface-400 text-sm">
                          Due: {formatDate(task.dueDate)}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {task.status !== 'Completed' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'Completed')}
                            className="px-3 py-1.5 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                        
                        {task.status === 'Completed' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'Not Started')}
                            className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                          >
                            Reopen
                          </button>
                        )}
                        
                        {task.status === 'Not Started' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'In Progress')}
                            className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                          >
                            Start Task
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Task creation form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <MainFeature onAddTask={addTask} />
        </motion.div>
      </div>
    </div>
  );
}