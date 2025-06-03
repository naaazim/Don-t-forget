import { useState, useEffect } from "react";
import axios from "axios";
import ModifierTache from "./ModiferTache";

function ListeDesTaches({ id }) {
    const [taches, setTaches] = useState([]);
    const [error, setError] = useState("");

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

    // Fonction pour retirer une tâche localement
    const supprimerTacheLocalement = (tacheId) => {
        setTaches(taches.filter((t) => t.id !== tacheId));
    };

    if (error) return <p>{error}</p>;

    return (
        <div>
            {taches.length === 0 ? (
                <p>Aucune tâche trouvée.</p>
            ) : (
                <ul>
                    {taches.map((tache) => (
                        <li key={tache.id}>
                            {tache.texte} - Deadline: {new Date(tache.mustBeFinishedAt).toLocaleString()}
                            <ModifierTache id={tache.id} onDelete={() => supprimerTacheLocalement(tache.id)} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListeDesTaches;
