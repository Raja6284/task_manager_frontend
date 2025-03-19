"use client"

import { createContext, useState, useEffect } from "react"

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // Get the initial theme from localStorage or default to false (light mode)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"
  })

  // Apply the theme class to the document element whenever darkMode changes
  useEffect(() => {
    // Save the current theme preference to localStorage
    localStorage.setItem("darkMode", darkMode)

    // Apply or remove the 'dark' class based on the theme
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    console.log("Theme applied:", darkMode ? "dark" : "light")
  }, [darkMode])

  // Function to toggle between light and dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode)
  }

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
}

