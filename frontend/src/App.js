import React, {useState} from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Create from './Containers/Create/Create';
import Event from './Containers/Event/Event';
import Error from './Containers/Error/Error';

import Header from './Components/Header';
import Info from './Components/Info';

import './App.css';

function App() {
  const [openAboutModal,setOpenAboutModal] = useState(false);
  const handleOpenAboutModal = () => {
    setOpenAboutModal(true);
  }
  const handleCloseAboutModal = () => {
    setOpenAboutModal(false);
  }

  return (
    <div className="App">
      <Helmet>
        <title>How2split</title>
      </Helmet>
      <Header openModal={handleOpenAboutModal} />
      {
        openAboutModal &&
        <Info openModal={openAboutModal} closeModal={handleCloseAboutModal} />
      }
      <Router>
        <Routes>
          <Route path="/" element={<Create />} />
          <Route path="/events/:id" element={<Event />} />
          {/* <Route path="/event" element={<Event />} /> */}
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
