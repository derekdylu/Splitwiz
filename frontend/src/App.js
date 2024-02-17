import React, {useState} from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Create from './Containers/Create/Create';
import Event from './Containers/Event/Event';
import Error from './Containers/Error/Error';
import About from './Containers/About/About';

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
        <meta name="description" content="How2split 是一款極輕量化線上帳目分攤工具，無需下載應用程式、無需註冊帳號，只要建立活動然後記住並分享連結，即可立即開始使用。" />
        <link rel="canonical" href="https://how2split.online/" />
        <meta name="theme-color" content="#40a9ff" />
        <meta property="og:title" content="How2split" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://how2split.online/" />
        <meta property="og:image" content="https://how2split.online/og.jpg" />
        <meta property="og:description" content="How2split 是一款極輕量化線上帳目分攤工具，無需下載應用程式、無需註冊帳號，只要建立活動然後記住並分享連結，即可立即開始使用。" />
        <meta property="og:site_name" content="How2split" />
      </Helmet>
      <Header openModal={handleOpenAboutModal} />
      {
        openAboutModal &&
        <Info openModal={openAboutModal} closeModal={handleCloseAboutModal} />
      }
      <Router>
        <Routes>
          <Route path="/" element={<Create />} />
          <Route path="/about" element={<About />} />
          <Route path="/events/:id" element={<Event />} />
          {/* <Route path="/event" element={<Event />} /> */}
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
