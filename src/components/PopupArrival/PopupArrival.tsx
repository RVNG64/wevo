import React from 'react';
import './PopupArrival.css';

const Popup = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
  if (!show) return null;

  return (
    <div className="popup-backdrop">
      <div className="popup-container">
        <h2 style={{ textAlign: 'center' }}>Bienvenue sur WAZAA!</h2>
        <p>Nous sommes très heureux de vous accueillir pour le lancement de WAZAA, la toute nouvelle plateforme pour trouver des événements autour de soi.</p>
        <p>Actuellement active dans les départements 64 et 40, l'horizon s'élargira bientôt avec de nouvelles destinations partout en France !</p>
        <h3 style={{ textAlign: 'center' }}>Notre mission ?</h3>
        <p>Vous connecter à l'énergie de votre région et vous aider à trouver des événements qui vous passionnent. Que vous soyez amateur de concerts, d'expositions ou de rencontres communautaires, WAZAA est là pour enrichir votre expérience locale.</p>
        <p>De nouveaux événements sont ajoutés chaque jour, la plateforme évolue constamment et votre feedback est essentiel pour nous.</p>
        <p>Rejoignez la communauté, n'hésitez pas à partager vos idées et suggestions pour améliorer WAZAA.</p>
        <p>Explorez, vivez, partagez. WAZAA, votre prochaine grande découverte vous attend.</p>
        <h3>Bon voyage, bonne exploration !</h3>
        <h2>WAZAA</h2>
        <div className="popup-arrival_button">
          <button onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
