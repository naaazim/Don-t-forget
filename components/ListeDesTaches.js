import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ModifierTache from "./ModiferTache";
import styles from "../style/listeDesTaches.module.css";

function ListeDesTaches({ id }) {
    const [taches, setTaches] = useState([]);
    const [error, setError] = useState("");
    const [visible, setVisible] = useState(true); // <--- contrôle l'affichage
    const divisionRef = useRef(null);

    useEffect(() => {
        const fetchTaches = async () => {
            try {
                const reponse = await axios.get(`http://localhost:8080/api/v1/tache/getAllByUser/${id}`);
                setTaches(reponse.data);
            } catch (err) {
                setError("Erreur lors de la récupération des tâches.");
            }
        };
        if (id) fetchTaches();
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (divisionRef.current && !divisionRef.current.contains(event.target)) {
                setVisible(false); // <--- fermer la division
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fonction pour retirer une tâche localement
    const supprimerTacheLocalement = (tacheId) => {
        setTaches(taches.filter((t) => t.id !== tacheId));
    };

    if (error) return <p>{error}</p>;
    if (!visible) return null;

    return (
        <div className={styles.division} ref={divisionRef}>
            {taches.length === 0 ? (
                <p className={styles.rien}>Aucune tâche à effectuer pour l'instant.</p>
            ) : (
                <ul>
                    {taches.map((tache) => (
                        <li key={tache.id} className={styles.element}>
                            <h3>{tache.texte}</h3> 
                            <div className={styles.echeance}>
                                <p>Échéance: {new Date(tache.mustBeFinishedAt).toLocaleString()}</p>
                                <ModifierTache id={tache.id} onDelete={() => supprimerTacheLocalement(tache.id)} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListeDesTaches;
