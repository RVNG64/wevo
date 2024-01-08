import React, { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface MapContextType {
  mapInstance: L.Map | null;
  setMapInstance: Dispatch<SetStateAction<L.Map | null>>;
}

const MapContext = createContext<MapContextType>({
  mapInstance: null,
  setMapInstance: () => {}
});

interface UpdateMapRefProps {
  mapRef: React.MutableRefObject<L.Map | null>;
}

const UpdateMapRef: React.FC<UpdateMapRefProps> = ({ mapRef }) => {
  const { setMapInstance } = useContext(MapContext);

  useMapEvents({
    load: (mapEvent) => {
      const mapInstance = mapEvent.target as L.Map;
      mapRef.current = mapInstance;
      setMapInstance(mapInstance); // Mettre à jour mapInstance dans le contexte
      console.log("Map chargée, instance de la carte:", mapInstance);
    },
  });

  return null;
};

export const useMapContext = () => useContext(MapContext);

export default MapContext;
