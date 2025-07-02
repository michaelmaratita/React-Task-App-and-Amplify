import React, { useState, useEffect } from 'react';
import './App.css';
import AuthHeader from './AuthHeader';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { ThemeProvider, createTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const API_URL = "INPUT_API_URL_HERE";

const customTheme = createTheme({
  name: 'dark-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#1a1a1d' },
      },
      font: {
        primary: { value: '#f1f1f1' },
        secondary: { value: '#ccc' },
      },
      brand: {
        primary: {
          10: '#007b83',
          80: '#00adb5',
          100: '#00adb5',
        },
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: { value: '#00adb5' },
          color: { value: '#fff' },
          _hover: {
            backgroundColor: { value: '#00c8d6' },
          },
        },
      },
    },
  },
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchTasksFromAPI();
  }, []);

  async function fetchTasksFromAPI() {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setTasks(data.items || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }

  async function addTask() {
    if (!input.trim()) {
      alert("Input cannot be empty!");
      return;
    }

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: input,
          complete: "false",
          action: "add"
        })
      });
      setInput('');
      fetchTasksFromAPI();
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Could not save task.");
    }
  }

  async function deleteTask(taskName) {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: taskName,
          complete: "true",
          action: "delete"
        })
      });
      fetchTasksFromAPI();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Could not delete task.");
    }
  }

  async function updateTaskCompletion(taskName, complete) {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: taskName,
          complete: complete.toString(),
          action: "update"
        })
      });
      fetchTasksFromAPI();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Could not update task.");
    }
  }

  return (
    <ThemeProvider theme={customTheme}>
        <div className="auth-container">
        <Authenticator components={{ Header: AuthHeader }}>
            {({ signOut }) => (
            <div className="container">
                <div className="todo-app">
                <h2>To-Do Tasks</h2>
                <div className="row">
                    <input
                    type="text"
                    placeholder="Add your task"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    />
                    <button onClick={addTask}>Add</button>
                </div>
                <ul>
                    {tasks.map(task => (
                    <li
                        key={task.task}
                        className={task.complete === "true" || task.complete === true ? "checked" : ""}
                        onClick={() =>
                        updateTaskCompletion(task.task, !(task.complete === "true" || task.complete === true))
                        }
                    >
                        {task.task}
                        <span onClick={(e) => { e.stopPropagation(); deleteTask(task.task); }}>&times;</span>
                    </li>
                    ))}
                </ul>
                <button onClick={signOut} style={{ marginTop: '20px' }}>Sign Out</button>
                </div>
            </div>
            )}
        </Authenticator>
        </div>
    </ThemeProvider>
    );
}

export default App;
