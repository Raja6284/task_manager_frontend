"use client"

import { useState, useEffect, useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"

const TaskForm = ({ onSubmit, initialData, onCancel }) => {
  const { darkMode } = useContext(ThemeContext)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        priority: initialData.priority || "medium",
      })
    } else {
      // Reset form when not editing
      setFormData({
        title: "",
        description: "",
        priority: "medium",
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Ensure priority is included in the submission
    onSubmit({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="transition-colors duration-300">
      <div className="mb-4">
        <label className="block text-black dark:text-white mb-2" htmlFor="title">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Task title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-black dark:text-white mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Task description"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-black dark:text-white mb-2" htmlFor="priority">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white dark:bg-blue-600 rounded hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors"
        >
          {initialData ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  )
}

export default TaskForm

