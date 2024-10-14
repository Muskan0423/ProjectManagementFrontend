import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = 'http://localhost:3001/api/users';

export const loadTasks = createAsyncThunk('todos/loadTasks', async (token) => {
    const response = await axios.get(`${apiUrl}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    
    localStorage.setItem('tasks', JSON.stringify(response.data.tasks)); // Store tasks in local storage
    return response.data.tasks;
});

export const addTask = createAsyncThunk('todos/addTask', async ({ task, token }) => {
    const response = await axios.post(`${apiUrl}/task`, { name: task }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.task; 
});

export const updateTask = createAsyncThunk('todos/updateTask', async ({ id, text, token }) => {
    await axios.put(`${apiUrl}/task/${id}`, { name: text }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return { id, text }; 
});

export const deleteTask = createAsyncThunk('todos/deleteTask', async ({ id, token }) => {
    await axios.delete(`${apiUrl}/task/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return id; 
});

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        taskList: [],
        editingId: null,
    },
    reducers: {
        startEditing: (state, action) => {
            state.editingId = action.payload.id;
        },
        toggleCompleted: (state, action) => {
            const task = state.taskList.find(t => t._id === action.payload);
            if (task) {
                task.completed = !task.completed;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTasks.fulfilled, (state, action) => {
                state.taskList = action.payload;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.taskList.push(action.payload);
                localStorage.setItem('tasks', JSON.stringify(state.taskList));
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.taskList.findIndex(t => t._id === action.payload.id);
                if (index !== -1) {
                    state.taskList[index].name = action.payload.text; 
                    localStorage.setItem('tasks', JSON.stringify(state.taskList)); 
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.taskList = state.taskList.filter(t => t._id !== action.payload);
                localStorage.setItem('tasks', JSON.stringify(state.taskList));
            });
    },
});

export const { startEditing, toggleCompleted } = todoSlice.actions;
export default todoSlice.reducer;
