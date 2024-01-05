import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { POI, useEvents } from '../EventContext';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import L from 'leaflet';
import EventFilter from '../components/EventFilter/EventFilter';
import EventDetails from '../components/EventDetails/EventDetails';
import './Map.css';

const mapMarker = new L.Icon({
  iconUrl: '/map-marker.svg',
  iconRetinaUrl: '/map-marker.svg',
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [25, 55],
});

const MapWazaa = () => {
  const position: [number, number] = [43.4833, -1.4833]; // Coordonnées par défaut comme un tuple de type [number, number]
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { events, setEvents } = useEvents();
  const navigate = useNavigate();

  // Fonction pour gérer le clic sur le contenu de la popup Leaflet
  const handlePopupContentClick = (poi: POI) => {
    setSelectedPoi(poi);
    // setShowDetails(true);
    const uniqueId = poi.URI_ID_du_POI;
    navigate(`/event/${uniqueId}`);
  };

  const renderDetailsPopup = () => {
    if (!selectedPoi) return null;
    return (
      <div className={`details-popup ${showDetails ? 'show' : ''}`}>
        {/* Contenu de la popup de détail */}
        <h2>{selectedPoi.Nom_du_POI}</h2>
        <p>{selectedPoi.Createur_de_la_donnee}</p>
        <p>{selectedPoi.Periodes_regroupees}</p>
        <p>{selectedPoi.Description}</p>
        {/* ... autres informations du POI ... */}
        <button onClick={() => setShowDetails(false)}>Fermer</button>
      </div>
    );
  };

  const estCodePostalValide = (codePostalEtCommune: string) => {
    const codePostal = codePostalEtCommune.split('#')[0];
    return codePostal.startsWith("40") || codePostal.startsWith("64");
  };

  const currentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

    // Convertit une date au format 'YYYY-MM-DD'
    const formatDate = (date: string) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const estDateDansPeriode = (periode: string, dateDebutRecherche: Date, dateFinRecherche: Date) => {
      if (!periode) return false;

      const [dateDebutEvenement, dateFinEvenement] = periode.split('<->').map(formatDate);
      const debutEvenement = new Date(dateDebutEvenement);
      const finEvenement = dateFinEvenement ? new Date(dateFinEvenement) : debutEvenement;

      return (debutEvenement <= dateFinRecherche && finEvenement >= dateDebutRecherche);
    };

  const dateToday = currentDate();

  const poisFiltres = events.filter((poi: POI) => {
    const dateDebut = new Date(formatDate(searchStartDate || currentDate()));
    const dateFin = searchEndDate ? new Date(formatDate(searchEndDate)) : dateDebut;

    return estDateDansPeriode(poi.Periodes_regroupees, dateDebut, dateFin) &&
            estCodePostalValide(poi.Code_postal_et_commune) &&
            (searchQuery ? poi.Nom_du_POI.toLowerCase().includes(searchQuery.toLowerCase()) : true);
  });

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEndDate(event.target.value);
  };

  // Ajout d'un identifiant unique à chaque POI
  useEffect(() => {
    fetch('/bddEvents.json')
      .then((response) => response.json())
      .then((data: POI[]) => {
        const eventsWithId = data.map((event: POI) => ({
          ...event,
          eventId: uuidv4(), // Ajoute un identifiant unique à chaque événement
        }));
        setEvents(eventsWithId);
      });
  }, []);

  return (
    <>
      <EventFilter
        setSearchStartDate={setSearchStartDate}
        setSearchEndDate={setSearchEndDate}
        setSearchQuery={setSearchQuery}
      />

      <MapContainer
        center={position}
        zoom={13}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
          {poisFiltres.map((poi, index) => {
            const latitude = parseFloat(poi.Latitude);
            const longitude = parseFloat(poi.Longitude);

            if (!isNaN(latitude) && !isNaN(longitude)) {
              return (
                <Marker
                  key={`${poi.URI_ID_du_POI}-${index}`}
                  position={[latitude, longitude]}
                  icon={mapMarker}
                >
                  <Popup className='leaflet-popup-content'>
                    <div onClick={() => handlePopupContentClick(poi)}>
                      <h2>{poi.Nom_du_POI}</h2>
                      <p>{poi.Createur_de_la_donnee}</p>
                      <p>{poi.Periodes_regroupees}</p>
                      {/*poi.Description*/}
                      {/* ... autres informations du POI ... */}
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
      </MapContainer>
      {renderDetailsPopup()}
      {showDetails && selectedPoi && (
        <EventDetails/>
      )}
    </>
  );
};

export default MapWazaa;
