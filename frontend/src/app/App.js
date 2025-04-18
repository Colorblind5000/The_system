// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ChatView from './components/ChatView';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <nav style={{ width: '200px', borderRight: '1px solid #ccc', padding: '20px' }}>
          <ul>
            <li>
              <Link to="/chat">Chat</Link>
            </li>
            {/* Additional menu items can be added here */}
          </ul>
        </nav>
        <main style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/chat" element={<ChatView />} />
            {/* Other routes can be included here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
