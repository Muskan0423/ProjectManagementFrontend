// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../src/Slices/TodoSlice';

const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

export default store;
