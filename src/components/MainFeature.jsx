import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

export default function MainFeature({ onAddTask }) {
  // Declare icon components
  const PlusIcon = getIcon('Plus');
  const XIcon = getIcon('X');
  const CalendarIcon = getIcon('Calendar');
  const TagIcon = getIcon('Tag');
  const CheckSquareIcon = getIcon('CheckSquare');
  
  // State for form values
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";
    
    // If there are errors, show them and don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Create the new task
    const newTask = {
      title,
      description,
      status: 'Not Started',
      priority,
      dueDate: new Date(dueDate),
      tags: tags.length > 0 ? tags : ['general']
    };
    
    // Animation before adding task
    setIsAnimating(true);
    setTimeout(() => {
      onAddTask(newTask);
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setTags([]);
      setTag('');
      setErrors({});
      setIsAnimating(false);
    }, 300);
  };
  
  // Add a tag to the list
  const addTag = () => {
    if (tag.trim() && !tags.includes(tag.trim().toLowerCase())) {
      setTags([...tags, tag.trim().toLowerCase()]);
      setTag('');
    } else if (tags.includes(tag.trim().toLowerCase())) {
      toast.info("Tag already added");
    }
  };
  
  // Remove a tag from the list
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Get tomorrow's date in YYYY-MM-DD format for the date input min value
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Handle keydown in tag input
  const handleTagKeyDown = (e) => {
    // Add tag when Enter or comma is pressed
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CheckSquareIcon className="text-primary" size={20} />
          Add New Task
        </h2>
      </div>

      <motion.form 
        onSubmit={handleSubmit}
        className={`space-y-4 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Task Title*
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                setErrors({...errors, title: undefined});
              }
            }}
            className={`input ${errors.title ? 'border-red-500 dark:border-red-500' : ''}`}
            placeholder="What needs to be done?"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description*
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                setErrors({...errors, description: undefined});
              }
            }}
            rows={3}
            className={`input resize-none ${errors.description ? 'border-red-500 dark:border-red-500' : ''}`}
            placeholder="Add details about this task"
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
              Due Date*
            </label>
            <div className="relative">
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                min={getTomorrow()}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (errors.dueDate) {
                    setErrors({...errors, dueDate: undefined});
                  }
                }}
                className={`input pl-10 ${errors.dueDate ? 'border-red-500 dark:border-red-500' : ''}`}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500">
                <CalendarIcon size={16} />
              </div>
            </div>
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags
          </label>
          <div className="flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                id="tags"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="input pl-9"
                placeholder="Add tags (press Enter or comma to add)"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500">
                <TagIcon size={16} />
              </div>
            </div>
            <button
              type="button"
              onClick={addTag}
              className="ml-2 p-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              <PlusIcon size={20} />
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map(tag => (
                <div 
                  key={tag} 
                  className="flex items-center gap-1 bg-surface-200 dark:bg-surface-700 px-2 py-1 rounded-full text-sm group"
                >
                  #{tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(tag)}
                    className="w-4 h-4 rounded-full flex items-center justify-center bg-surface-300 dark:bg-surface-600 opacity-70 group-hover:opacity-100 transition-opacity"
                  >
                    <XIcon size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <motion.button
          type="submit"
          className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          whileTap={{ scale: 0.98 }}
          disabled={isAnimating}
        >
          <span className="flex items-center justify-center gap-2">
            <PlusIcon size={18} />
            Add Task
          </span>
        </motion.button>
      </motion.form>

      <div className="mt-6 p-4 bg-surface-100 dark:bg-surface-800 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Task Stats</h3>
        <div className="text-sm text-surface-600 dark:text-surface-400">
          Focus on High Priority tasks first to maximize productivity. Break down large tasks into smaller, manageable steps.
        </div>
      </div>
    </div>
  );
}