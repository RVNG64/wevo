import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

interface EventsProviderProps {
  children: React.ReactNode;
}

const EventsContext = createContext<EventsContextProps | null>(null);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents doit être utilisé au sein d\'un EventsProvider');
  }
  return context;
};

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<POI[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/bddEvents.json');
        const data = await response.json();
        const modifiedData = data.map((event: POI) => ({
          ...event,
          URI_ID_du_POI: event.URI_ID_du_POI ? event.URI_ID_du_POI.split('/').pop() : ''
        }));
        setEvents(modifiedData);
        console.log("Events Loaded: ", modifiedData);
      } catch (error) {
        console.error("Erreur lors du chargement des événements", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      {children}
    </EventsContext.Provider>
  );
};
