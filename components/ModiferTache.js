import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import styles from "../style/modifierTache.module.css";
function ModifierTache({ id, onDelete }) {
    const [Texte, setTexte] = useState("");
    const [Statut, setStatut] = useState("");
    const [Reminder, setReminder] = useState("");
    const [togglePopup, setTogglePopUp] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [popUpNo, setPopUpNo] = useState(false);
    const [popUpYes, setPopUpYes] = useState(false);

    // Fonction pour convertir une date ISO en format datetime-local (sans fuseau)
    function toDatetimeLocal(isoString) {
        if (!isoString) return "";
        const date = new Date(isoString);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    }

    useEffect(() => {
        if (togglePopup) {
            axios.get(`http://localhost:8080/api/v1/tache/getById/${id}`)
                .then(res => {
                    const tache = res.data;
                    setTexte(tache.texte || "");
                    setStatut(tache.statut || "A_FAIRE");
                    setReminder(toDatetimeLocal(tache.reminder));
                })
                .catch(err => {
                    setErrorMessage("Erreur lors du chargement de la tâche");
                    setPopUpNo(true);
                    setTimeout(() => setPopUpNo(false), 2000);
                });
        }
    }, [togglePopup, id]);

    const deleteTache = async () => {
        try {
            const reponse = await axios.delete(`http://localhost:8080/api/v1/tache/delete/${id}`);
            setSuccessMessage(reponse.data);
            setPopUpYes(true);
            setPopUpNo(false);
            if (onDelete) onDelete(); // Notifie le parent pour retirer la tâche
        } catch (err) {
            setErrorMessage(err.response?.data || err.message || "Erreur lors de la suppression.");
            setPopUpNo(true);
            setTimeout(() => setPopUpNo(false), 2000);
        }
    };

    const soumission = async () => {
        try {
            const reponse = await axios.put(`http://localhost:8080/api/v1/tache/update/${id}`, {
                texte: Texte,
                statut: Statut,
                reminder: Reminder ? Reminder : null
            });
            setSuccessMessage(reponse.data.message || "Tâche mise à jour avec succès.");
            setPopUpNo(false);
            setPopUpYes(true);
            setTimeout(() => setPopUpYes(false), 3000);
        } catch (err) {
            setErrorMessage(err.response?.data || err.message || "Une erreur est survenue.");
            setPopUpNo(true);
            setPopUpYes(false);
            setTimeout(() => setPopUpNo(false), 3000);
        }
    };

    return (
        <>
            <button onClick={() => setTogglePopUp(true)} className={styles.edit}>
                <FiEdit />
            </button>
            <button onClick={deleteTache} className={styles.delete}>
                <MdDelete />
            </button>

            {togglePopup && (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    soumission();
                }}>
                    <label htmlFor="tache">Tâche:</label>
                    <input
                        type="text"
                        id="tache"
                        value={Texte}
                        onChange={(e) => setTexte(e.target.value)}
                        maxLength={255}
                    />
                    <label htmlFor="statut">Statut: </label>
                    <select id="statut" value={Statut} onChange={(e) => setStatut(e.target.value)}>
                        <option value="A_FAIRE">À faire</option>
                        <option value="EN_COURS">En cours</option>
                        <option value="FINI">Terminée</option>
                    </select>
                    <label htmlFor="reminder">Ajouter un rappel:</label>
                    <input
                        type="datetime-local"
                        id="reminder"
                        value={Reminder}
                        onChange={(e) => {
                            setReminder(e.target.value);
                        }}
                    />
                    <button type="button" onClick={() => setTogglePopUp(false)}>
                        Annuler
                    </button>
                    <button type="submit">Valider</button>
                </form>
            )}

            {popUpYes && <p style={{ textAlign: "center", color: "green" }}>{successMessage}</p>}
            {popUpNo && <p style={{ textAlign: "center", color: "red" }}>{errorMessage}</p>}
        </>
    );
}

export default ModifierTache;
