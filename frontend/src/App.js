import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Create from './Containers/Create/Create';
import Event from './Containers/Event/Event';
import Error from './Containers/Error/Error';

import './App.css';

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>React App</title>
      </Helmet>
      <Router>
        <Routes>
          <Route path="/" element={<Create />} />
          {/* <Route path="/event/:id" element={<Event />} /> */}
          <Route path="/event" element={<Event />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
