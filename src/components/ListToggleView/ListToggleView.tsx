import React from 'react';
import './ListToggleView.css';

interface ListViewToggleProps {
  toggleListView: () => void;
}

const ListViewToggle: React.FC<ListViewToggleProps> = ({ toggleListView }) => {
  return (
    <button className="list-view-toggle" onClick={toggleListView}>
      Basculer vers la Vue Liste
    </button>
  );
};

export default ListViewToggle;
