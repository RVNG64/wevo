import { useMapContext } from '../MapContext';
import './ListView.css';

interface POI {
  // Ajout des champs POI correspondants
  URI_ID_du_POI: string;
  Nom_du_POI: string;
  Description: string;
  Createur_de_la_donnee: string;
  Latitude: string;
  Longitude: string;
  Adresse_postale: string;
  Code_postal_et_commune: string;
  Periodes_regroupees: string;
}

interface ListViewProps {
  isVisible: boolean;
  events: POI[];
}

const ListView: React.FC<ListViewProps> = ({ isVisible, events }) => {
  const listViewClass = isVisible ? "list-view active" : "list-view";
  const { mapInstance } = useMapContext();

  /* const handleViewOnMap = (poi: POI) => {
    if (mapInstance) {
      mapInstance.flyTo([parseFloat(poi.Latitude), parseFloat(poi.Longitude)], 15);
    }
  }; */

  // Fonction pour obtenir le timestamp de la date de début
  const getStartDateTimestamp = (periodes: string) => {
    const startDate = periodes.split('<->')[0];
    return new Date(startDate).getTime(); // Convertit la date en timestamp
  };

  // Trier les événements par date de début
  const sortedEvents = events.sort((a, b) => {
    return getStartDateTimestamp(a.Periodes_regroupees) - getStartDateTimestamp(b.Periodes_regroupees);
  });

  return (
    <div className={listViewClass}>
      {sortedEvents.map((event: POI) => (
        <div key={event.URI_ID_du_POI} className="list-item">
          <div className="item-image">
            {/* Image ou icône représentative pour chaque POI */}
            <img
              src={`https://res.cloudinary.com/dvzsvgucq/image/upload/v1696004383/hervemake_A_bustling_Airbnb_street_festival_where_every_booth_r_ac047cf3-5707-453a-8b73-a63c12a75ea9_d35qpn.png`}
              alt={event.Nom_du_POI} />
          </div>
          <div className="item-content">
            <h3>{event.Nom_du_POI}</h3>
            <p className="item-description">{event.Description}</p>
            <div className="item-info">
              <span>{event.Adresse_postale}, {event.Code_postal_et_commune.split('#')[1]}</span>
              <span className="item-date">{event.Periodes_regroupees}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView;
