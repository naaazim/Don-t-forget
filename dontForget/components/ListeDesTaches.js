import { useState, useEffect } from "react";
import axios from "../axiosConfig";
import ModifierTache from "./ModiferTache";
import styles from "../style/listeDesTaches.module.css";

function ListeDesTaches({ taches, setTaches, onUpdate }) {
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTaches = async () => {
            try {
                const reponse = await axios.get(`/api/v1/tache/me`, { withCredentials: true });
                setTaches(reponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (err) {
                setError("Erreur lors de la récupération des tâches.");
            }
        };
        if (taches.length === 0) fetchTaches();
    }, [setTaches, taches.length]);

    const supprimerTacheLocalement = (tacheId) => {
        setTaches(taches.filter((t) => t.id !== tacheId));
    };

    const handleCheckboxChange = async (tache) => {
        const nouveauStatut = tache.statut === "FINI" ? "A_FAIRE" : "FINI";
        try {
            await axios.put(`/api/v1/tache/update/${tache.id}`, { statut: nouveauStatut }, { withCredentials: true });
            setTaches((prev) =>
                prev.map((t) => (t.id === tache.id ? { ...t, statut: nouveauStatut } : t))
            );
        } catch (err) {
            console.error("Erreur lors de la mise à jour de la tâche :", err);
        }
    };

    if (error) return <p>{error}</p>;

    return (
        <div className={styles.division}>
            {taches.length === 0 ? (
                <p className={styles.rien}>Aucune tâche à effectuer pour l'instant.</p>
            ) : (
                <ul>
                    {taches.map((tache) => (
                        <li key={tache.id} className={styles.element}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <input
                                    type="checkbox"
                                    checked={tache.statut === "FINI"}
                                    onChange={() => handleCheckboxChange(tache)}
                                    style={{
                                        marginRight: "15px",
                                        cursor: "pointer",
                                        transform: "scale(1.5)",
                                    }}
                                />
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <h3
                                        style={{
                                            textDecoration: tache.statut === "FINI" ? "line-through" : "none",
                                        }}
                                    >
                                        {tache.texte}
                                    </h3>
                                    <ModifierTache
                                        id={tache.id}
                                        onDelete={() => supprimerTacheLocalement(tache.id)}
                                        onUpdate={onUpdate} 
                                    />
                                </div>
                            </div>
                            <div className={styles.echeance}>
                                <p>Échéance: {new Date(tache.mustBeFinishedAt).toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListeDesTaches;
