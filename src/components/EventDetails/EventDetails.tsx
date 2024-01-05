import React from 'react';
import { useParams } from 'react-router-dom';
import { useEvents } from '../../EventContext';
import './EventDetails.css';

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  console.log("EventId : " + eventId);
  const { events } = useEvents();
  console.log("Events : " + events);
  const eventData = events.find(e => e.URI_ID_du_POI.split('/').pop() === eventId);
  console.log("EventData : " + eventData);

  if (!eventData) {
    return <div>Chargement des détails de l'événement...</div>;
  }

  return (
    <div className="event-details">
      <h2>{eventData?.Nom_du_POI}</h2>
      <p>{eventData?.Createur_de_la_donnee}</p>
      <p>Description : {eventData.Description}</p>
      <p>Adresse : {eventData.Adresse_postale}, {eventData.Code_postal_et_commune.split('#')[1]}</p>
      <p>Période : {eventData.Periodes_regroupees}</p>
    </div>
  );
};

export default EventDetails;
