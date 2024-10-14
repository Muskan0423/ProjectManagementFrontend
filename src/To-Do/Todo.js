import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addTask, deleteTask, toggleCompleted, startEditing, updateTask, loadTasks } from '../Slices/TodoSlice';
import "./todo.css";
import { useNavigate } from "react-router-dom";

const Todo = ({ token }) => {
  const [task, setTask] = useState("");
  const navigate=useNavigate()
  const taskList = useSelector(state => state.todos.taskList);
  const editingId = useSelector(state => state.todos.editingId);
  const dispatch = useDispatch();

  // Fetch tasks when the component mounts or the token changes
  useEffect(() => {
    if (token) {
      dispatch(loadTasks(token));
    }
  }, [dispatch, token]);

  const handleClick = () => {
    if (task.trim() === "") {
      alert("Please enter a task.");
      return;
    }

    dispatch(addTask({ task, token })).then(() => {
      setTask(""); 
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteTask({ id, token }));
  };
  const handleLogout = () => {
   localStorage.clear();
   navigate("/")
   window.location.reload()

  };

  const checkCompleted = (id) => {
    dispatch(toggleCompleted(id));
  };

  const editTask = (id, currentText, isCompleted) => {
    if (isCompleted) {
      alert("You are not able to edit this");
      return;
    }

    dispatch(startEditing({ id }));
    setTask(currentText);
  };

  const handleEdit = () => {
    if (editingId) {
      dispatch(updateTask({ id: editingId, text: task, token })).then(() => {
        setTask(""); // Clear input after updating the task
      });
    }
  };

  return (
    <div className="todo-container">
      <h1>To Do</h1>
      <input
        type="text"
        id="task-input"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button id="add-task-btn" onClick={editingId ? handleEdit : handleClick}>
        {editingId ? "Update Task" : "Add Task"}
      </button>
      <ul id="task-list">
        {taskList.map(t => (
          <li key={t._id} className={t.completed ? "completed" : ""}>
            {t.name}
            <button className="delete-btn" onClick={() => handleDelete(t._id)}>
              Delete
            </button>
            <button id="CheckCompleted" onClick={() => checkCompleted(t._id)}>
              {t.completed ? "✔️" : ""}
            </button>
            <button id="Edit" onClick={() => editTask(t._id, t.name, t.completed)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
      <button onClick={()=>handleLogout()}>LogOut</button>
    </div>
  );
};

export default Todo;
