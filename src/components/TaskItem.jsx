"use client"

const TaskItem = ({ task, onDelete, onEdit, onToggleComplete, darkMode }) => {
  // For dark mode, use colored priorities
  const darkModePriorityColors = {
    low: "bg-green-900 text-green-300 border-green-800",
    medium: "bg-yellow-900 text-yellow-300 border-yellow-800",
    high: "bg-red-900 text-red-300 border-red-800",
  }

  // For light mode, use black and white
  const lightModePriorityColors = {
    low: "bg-gray-100 text-black border-gray-300",
    medium: "bg-gray-200 text-black border-gray-300",
    high: "bg-gray-300 text-black border-gray-300",
  }

  // Choose the appropriate colors based on the theme
  const priorityColors = darkMode ? darkModePriorityColors : lightModePriorityColors

  // For dark mode, use colored borders
  const darkModePriorityBorders = {
    low: "border-l-green-600",
    medium: "border-l-yellow-600",
    high: "border-l-red-600",
  }

  // For light mode, use grayscale borders
  const lightModePriorityBorders = {
    low: "border-l-gray-400",
    medium: "border-l-gray-600",
    high: "border-l-black",
  }

  // Choose the appropriate borders based on the theme
  const priorityBorders = darkMode ? darkModePriorityBorders : lightModePriorityBorders

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-colors duration-300 border-l-4 ${priorityBorders[task.priority] || "border-l-gray-500"} border border-gray-200 dark:border-gray-700`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task._id, !task.completed)}
            className="mt-1 h-5 w-5 text-black dark:text-blue-600 focus:ring-black dark:focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <div className={`flex-1 ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""}`}>
            <h3 className="font-medium text-black dark:text-white">{task.title}</h3>
            {task.description && <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{task.description}</p>}
            <div className="flex items-center mt-2">
              <span
                className={`text-xs px-2 py-1 rounded border ${priorityColors[task.priority] || priorityColors.medium}`}
              >
                {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : "Medium"} Priority
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-black hover:text-gray-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-blue-900"
            aria-label="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-black hover:text-gray-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-red-900"
            aria-label="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskItem

