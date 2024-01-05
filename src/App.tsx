import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { EventsProvider } from './EventContext';
import './App.css';
import MapWazaa from './Map/Map';
import Navbar from './components/Navbar/Navbar';
import EventDetails from './components/EventDetails/EventDetails';

function App() {
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
        </div>
      </EventsProvider>
    </Router>
  );
}

export default App;
