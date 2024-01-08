import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { POI, useEvents } from '../EventContext';
// @ts-ignore
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import L from 'leaflet';
import EventDetails from '../components/EventDetails/EventDetails';
import LoadingAnimation from '../components/WazaaLoading/WazaaLoading';
import ListViewToggle from '../components/ListToggleView/ListToggleView';
import ListView from '../components/ListView/ListView';
import MapContext from '../components/MapContext';
import './Map.css';

const mapMarker = new L.Icon({
  iconUrl: '/map-marker.svg',
  iconRetinaUrl: '/map-marker.svg',
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [25, 55],
});

type SearchEventsButtonProps = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchEventsButton = ({ setIsLoading }: SearchEventsButtonProps) => {
  const map = useMap();
  const { fetchEventsInBounds, setEvents } = useEvents();
  const [showSearchButton, setShowSearchButton] = useState(false);

  useMapEvents({
    moveend: () => setShowSearchButton(true),
    zoomend: () => setShowSearchButton(true),
  });

  const handleSearch = () => {
    setIsLoading(true);
    const bounds = map.getBounds();
    fetchEventsInBounds(bounds).then(newEvents => {
      setEvents(newEvents);
      setShowSearchButton(false);
      setIsLoading(false);
    });
  };

  return (
    <>
      {showSearchButton ? (
        <button className="search-events-btn" onClick={handleSearch}>
          WAZAA dans le coin ?
        </button>
      ) : null}
    </>
  );
};

const InitializeMapEvents = () => {
  const { initializeEvents } = useEvents();
  const map = useMap();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      console.log("Initialisation des événements pour les limites actuelles de la carte");
      initializeEvents(map.getBounds());
      isInitialized.current = true;
    }
  }, [map, initializeEvents]);

  return null; // Ce composant ne rend rien
};

interface UpdateMapRefProps {
  mapRef: MutableRefObject<L.Map | null>;
}

const UpdateMapRef: React.FC<UpdateMapRefProps> = ({ mapRef }) => {
  useMapEvents({
    load: (mapEvent) => {
      const mapInstance = mapEvent.target as L.Map;
      mapRef.current = mapInstance;
      console.log("mapRef après mise à jour:", mapRef);
      console.log("Événement de chargement déclenché, mapInstance:", mapInstance);
    },
  });

  return null;
};

const MapWazaa = () => {
  const position: [number, number] = [43.4833, -1.4833]; // Coordonnées par défaut
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListViewVisible, setIsListViewVisible] = useState(false);
  const { events } = useEvents();
  const mapRef = useRef(null);

  const handleMarkerClick = (poi: POI) => {
    console.log(`Original ID: ${poi.URI_ID_du_POI}`);
    const eventId = poi.URI_ID_du_POI.split('/').pop();
    console.log(`Truncated ID for navigation: ${eventId}`);
    window.history.pushState({}, '', `/event/${eventId}`); // Change l'URL sans naviguer
    setSelectedPoi(poi); // Met à jour les détails de l'événement sélectionné
    setShowDetails(true); // Ouvre la popup
  };

  const toggleListView = () => {
    setIsListViewVisible(!isListViewVisible);
  };

  // Met à jour les détails de l'événement en fonction de l'URL
  useEffect(() => {
    const eventId = window.location.pathname.split('/event/')[1];
    if (eventId) {
      console.log(`Event ID from URL: ${eventId}`);
      const eventDetails = events.find(e => e.URI_ID_du_POI === eventId);
      console.log(`Event details found:`, eventDetails);
      setSelectedPoi(eventDetails ?? null);
      setShowDetails(!!eventDetails);
    }
  }, [events]);

  const handleCloseDetails = () => {
    setShowDetails(false);
    window.history.pushState({}, '', '/'); // Retour à l'URL de base
  };

  const renderDetailsPopup = () => {
    if (!selectedPoi) return null;

      // Fonction pour partager l'événement
      const shareEvent = () => {
        const eventUrl = window.location.href;
        navigator.clipboard.writeText(eventUrl)
          .then(() => alert("Lien copié dans le presse-papiers !"))
          .catch(err => console.error("Impossible de copier le lien", err));
      };

    return (
      <div className={`details-popup ${showDetails ? 'show' : ''}`}>
        {/* Contenu de la popup de détail */}
        <h2>{selectedPoi.Nom_du_POI}</h2>
        <p>{selectedPoi.Createur_de_la_donnee}</p>
        <p>{selectedPoi.Periodes_regroupees}</p>
        <p>{selectedPoi.Description}</p>
        {/* ... autres informations du POI ... */}
        <button className="share-btn" onClick={shareEvent}>Partager</button>
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

  const poisFiltres = events.filter((poi: POI) => {
    const dateDebut = new Date(formatDate(searchStartDate || currentDate()));
    const dateFin = searchEndDate ? new Date(formatDate(searchEndDate)) : dateDebut;

    return estDateDansPeriode(poi.Periodes_regroupees, dateDebut, dateFin) &&
            estCodePostalValide(poi.Code_postal_et_commune) &&
            (searchQuery ? poi.Nom_du_POI.toLowerCase().includes(searchQuery.toLowerCase()) : true);
  });

  return (
    <>
      <LoadingAnimation isLoading={isLoading} />
      <ListViewToggle toggleListView={toggleListView} />
      <ListView isVisible={isListViewVisible} events={poisFiltres}/>

      <MapContainer
        center={position}
        zoom={13}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SearchEventsButton setIsLoading={setIsLoading} />
        <UpdateMapRef mapRef={mapRef} />
        <InitializeMapEvents />
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
                    <div onClick={() => handleMarkerClick (poi)}>
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
      {showDetails && selectedPoi && (
        <div className={`details-popup ${showDetails ? 'show' : ''}`}>
          <h2>{selectedPoi.Nom_du_POI}</h2>
          <p>{selectedPoi.Createur_de_la_donnee}</p>
          <p>{selectedPoi.Periodes_regroupees}</p>
          <p>{selectedPoi.Description}</p>
          <p>{selectedPoi.Adresse_postale}, {selectedPoi.Code_postal_et_commune.split('#')[1]}</p>
          {/* ... Autres détails de l'événement ... */}
          <button onClick={handleCloseDetails}>Fermer</button>
        </div>
      )}
    </>
  );
};

export default MapWazaa;

    // Fonction pour gérer le clic sur le contenu de la popup Leaflet
    /* const handlePopupContentClick = (poi: POI) => {
      setSelectedPoi(poi);
      // setShowDetails(true);
      const uniqueId = poi.URI_ID_du_POI;
      navigate(`/event/${uniqueId}`);
    }; */

    // Affiche les détails de l'événement si l'URL contient un identifiant d'événement
    /* useEffect(() => {
      const eventId = location.pathname.split('/event/')[1];
      if (eventId) {
        const eventDetails = events.find(e => e.URI_ID_du_POI === eventId);
        setSelectedEventDetails(eventDetails ?? null); // Utilisez 'null' si 'eventDetails' est 'undefined'
      }
    }, [location, events]); */
