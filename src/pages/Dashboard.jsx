"use client"

import { useState, useEffect, useContext } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import api from "../utils/api"
import TaskForm from "../components/TaskForm"
import TaskItem from "../components/TaskItem"
import Modal from "../components/Modal"
import { ThemeContext } from "../context/ThemeContext"

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingTask, setEditingTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { darkMode } = useContext(ThemeContext)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/tasks")
      // Sort tasks by order property to ensure consistent display
      const sortedTasks = res.data.sort((a, b) => a.order - b.order)
      setTasks(sortedTasks)
      setError("")
    } catch (error) {
      setError("Failed to fetch tasks")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (task) => {
    try {
      // Set the order to be at the end of the list
      const order = tasks.length > 0 ? Math.max(...tasks.map((t) => t.order)) + 1 : 0
      const res = await api.post("/api/tasks", { ...task, order })
      setTasks([...tasks, res.data])
      // Close the modal after adding a task
      setIsModalOpen(false)
    } catch (error) {
      setError("Failed to add task")
      console.error(error)
    }
  }

  const updateTask = async (id, updatedTask) => {
    try {
      const res = await api.patch(`/api/tasks/${id}`, updatedTask)
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)))
      setEditingTask(null)
      // Close the modal after updating a task
      setIsModalOpen(false)
    } catch (error) {
      setError("Failed to update task")
      console.error(error)
    }
  }

  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`)
      setTasks(tasks.filter((task) => task._id !== id))
    } catch (error) {
      setError("Failed to delete task")
      console.error(error)
    }
  }

  const toggleComplete = async (id, completed) => {
    try {
      const res = await api.patch(`/api/tasks/${id}`, { completed })
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)))
    } catch (error) {
      setError("Failed to update task")
      console.error(error)
    }
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order property for each task
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }))

    // Update the state immediately for a responsive UI
    setTasks(updatedItems)

    try {
      // Send the updated order to the server
      await api.post("/api/tasks/reorder", {
        tasks: updatedItems.map((task, index) => ({
          id: task._id,
          order: index,
        })),
      })
    } catch (error) {
      setError("Failed to update task order")
      console.error(error)
      // Revert to original order on error
      fetchTasks()
    }
  }

  const openEditModal = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    // Clear editing task when closing modal
    if (editingTask) {
      setEditingTask(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">Task Manager</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-black text-white dark:bg-blue-600 rounded-md hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create Task
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-gray-100 text-black dark:bg-red-100 dark:text-red-700 rounded">{error}</div>
      )}

      {/* Task Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTask ? "Edit Task" : "Create New Task"}>
        <TaskForm
          onSubmit={editingTask ? (task) => updateTask(editingTask._id, task) : addTask}
          initialData={editingTask}
          onCancel={closeModal}
        />
      </Modal>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-gray-300">Your Tasks</h2>

        {loading ? (
          <div className="text-center py-4">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-lg">No tasks yet.</p>
            <p className="mt-1">Click the "Create Task" button to get started!</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {tasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <TaskItem
                            task={task}
                            onDelete={deleteTask}
                            onEdit={openEditModal}
                            onToggleComplete={toggleComplete}
                            darkMode={darkMode}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  )
}

export default Dashboard

