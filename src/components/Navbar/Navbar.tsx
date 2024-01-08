import React, { useState } from 'react';
import './Navbar.css';
import '../EventFilter/EventFilter.css';

interface EventFilterProps {
  setSearchStartDate: (date: string) => void;
  setSearchEndDate: (date: string) => void;
  setSearchQuery: (query: string) => void;
}

const EventFilter: React.FC<EventFilterProps> = ({ setSearchStartDate, setSearchEndDate, setSearchQuery }) => {
  const [isPeriodSearch, setIsPeriodSearch] = useState(false);

  const handleToggleSearchType = () => {
    setIsPeriodSearch(!isPeriodSearch);
  };

  return (
    <div className="filter-container">
      <button onClick={handleToggleSearchType}>
        {isPeriodSearch ? "Recherche par date" : "Recherche par période"}
      </button>

      {!isPeriodSearch && (
        <input
          type="date"
          onChange={(e) => setSearchStartDate(e.target.value)}
          className="filter-date"
          placeholder="Choisir une date"
        />
      )}

      {isPeriodSearch && (
        <>
          <input
            type="date"
            onChange={(e) => setSearchStartDate(e.target.value)}
            className="filter-date"
            placeholder="Date de début"
          />
          <input
            type="date"
            onChange={(e) => setSearchEndDate(e.target.value)}
            className="filter-date"
            placeholder="Date de fin"
          />
        </>
      )}

      <input
        type="text"
        onChange={(e) => setSearchQuery(e.target.value)}
        className="filter-text"
        placeholder="Rechercher par mot-clé...  "
      />

    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">WAZAA</div>

      <EventFilter
        setSearchStartDate={() => { }}
        setSearchEndDate={() => { }}
        setSearchQuery={() => { }}
      />


      {/* Icône de profil */}
      <div className="navbar__rightcontainer">
        <button className="add-event-btn">Ajouter un événement</button>
        <img src="/profile.svg" alt="Profile" className="navbar__profile" />
      </div>
    </nav>
  );
};

export default Navbar;
