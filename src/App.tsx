import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { EventsProvider } from './EventContext';
import './App.css';
import MapWazaa from './Map/Map';
import Navbar from './components/Navbar/Navbar';
import EventDetails from './components/EventDetails/EventDetails';
import Popup from './components/PopupArrival/PopupArrival';

function App() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenPopup');

    if (!hasSeenPopup) {
      setTimeout(() => {
        setShowPopup(true);
      }, 3000); // 3000 ms = 3 secondes
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem('hasSeenPopup', 'true');
  };

  return (
    <Router>
      <EventsProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<MapWazaa />} />
            <Route path="/event/:eventId" element={<EventDetails />} />
            {/* Ajouter d'autres routes si nécessaire */}
          </Routes>
          <Popup show={showPopup} onClose={handleClosePopup} />
        </div>
      </EventsProvider>
    </Router>
  );
}

export default App;
