import React, { createContext, useContext, useState, useEffect } from 'react';
import L from 'leaflet';

export interface POI {
  Nom_du_POI: string;
  Categories_de_POI: string;
  Latitude: string;
  Longitude: string;
  Adresse_postale: string;
  Code_postal_et_commune: string;
  Periodes_regroupees: string;
  Covid19_mesures_specifiques: string;
  Createur_de_la_donnee: string;
  SIT_diffuseur: string;
  Date_de_mise_a_jour: string;
  Contacts_du_POI: string;
  Classements_du_POI: string;
  Description: string;
  URI_ID_du_POI: string;
}

interface EventsContextProps {
  events: POI[];
  setEvents: React.Dispatch<React.SetStateAction<POI[]>>;
  fetchEventsInBounds: (bounds: L.LatLngBounds) => Promise<POI[]>;
  initializeEvents: (bounds: L.LatLngBounds) => Promise<void>;
}

interface EventsProviderProps {
  children: React.ReactNode;
  initialBounds?: L.LatLngBounds;
}

const EventsContext = createContext<EventsContextProps | null>(null);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents doit être utilisé au sein d\'un EventsProvider');
  }
  return context;
};

export const EventsProvider: React.FC<EventsProviderProps> = ({ children, initialBounds }) => {
  const [events, setEvents] = useState<POI[]>([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/bddEvents.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors du chargement des événements", error);
      return [];
    }
  };

  const initializeEvents = async (bounds: L.LatLngBounds) => {
    try {
      const data = await fetchEvents();
      const initialEvents = data.filter((event: POI) => {
        const lat = parseFloat(event.Latitude);
        const lng = parseFloat(event.Longitude);
        if (isNaN(lat) || isNaN(lng)) {
          console.error(`Invalid coordinates for event: ${event.Nom_du_POI}`);
          return false;
        }
        const isInBounds = bounds.contains(L.latLng(lat, lng));
        return isInBounds;
      });
      console.log(`Initial events: ${initialEvents.length}`);
      setEvents(initialEvents);
    } catch (error) {
      console.error("Erreur lors du chargement des événements", error);
    }
  };

  const fetchEventsInBounds = async (bounds: L.LatLngBounds) => {
    const data = await fetchEvents();
    const filteredEvents = data.filter((event: POI) => {
      const lat = parseFloat(event.Latitude);
      const lng = parseFloat(event.Longitude);
      if (isNaN(lat) || isNaN(lng)) {
        console.error(`Invalid coordinates for event: ${event.Nom_du_POI}`);
        return false;
      }
      return bounds.contains(L.latLng(lat, lng));
    });

    console.log(`Bounds: ${bounds}`, 'Bounds details:', bounds.getNorthWest(), bounds.getSouthEast());
    console.log(`Filtered events: ${filteredEvents.length}`);
    setEvents(filteredEvents);
    return filteredEvents;
  };

  return (
    <EventsContext.Provider value={{ events, setEvents, fetchEventsInBounds, initializeEvents }}>
      {children}
    </EventsContext.Provider>
  );
};
