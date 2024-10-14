import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Todo from './To-Do/Todo';
import LoginSignup from './LoginSignUp/LoginSignup'; 


function App() {
  const token = localStorage.getItem('token');


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={token ? <Todo token={token} /> : <LoginSignup />} />
          <Route path="/todo" element={token ? <Todo token={token} /> : <LoginSignup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
