import React from "react";
import { EintragResource } from "../Resources";



// Props: { eintrag: EintragResource } - Eintrag-Objekt, das dargestellt werden soll
export function Eintrag({ eintrag }: { eintrag: EintragResource}) {
    return (
        <div className = "eintrag">
            <h2>{eintrag.getraenk}</h2>
            <p>Menge: {eintrag.menge}</p>
            {/* Überprüfung, ob ein Kommentar vorhanden ist und Anzeige, falls ja */}
            <p>Kommentar: {eintrag.kommentar}</p>
            <p>Ersteller: {eintrag.erstellerName}</p>
            <p>Erstellt am: {eintrag.createdAt}</p>
        </div>
    )
}

export default Eintrag;