import React, { useState } from 'react';
import { ProtokollResource } from '../Resources';


interface ProtokollDescriptionProps {
    protokoll: ProtokollResource;
    setSelectedProtokoll: (protokoll: ProtokollResource | null) => void;
  }
  

export const ProtokollDescription: React.FC<ProtokollDescriptionProps> = ({ protokoll, setSelectedProtokoll }) =>{
    const [showEintraege, setShowEintraege] = useState(false);
    const handleClick = () => {
        setSelectedProtokoll(protokoll);
        setShowEintraege(true);
      };

    return (
        <div className="card">
            <h2>Patient: {protokoll.patient}</h2>
            <h3>Datum: {protokoll.datum}</h3>
            <h3>Public: {protokoll.public ? 'Yes' : 'No'}</h3>
            <h3>Status: {protokoll.closed ? 'Closed' : 'Open'}</h3>
            <h3>Ersteller: {protokoll.erstellerName}</h3>
            <h3>Updated At: {protokoll.updatedAt}</h3> 
            <h3>Gesamt Menge: {protokoll.gesamtMenge}</h3>
          
            
        </div>
    );
};

export default ProtokollDescription;