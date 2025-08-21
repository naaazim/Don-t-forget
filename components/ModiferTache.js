import axios from "axios";
import { FiEdit3 } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { IoTrashOutline } from "react-icons/io5";
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

    // ref du formulaire pour détecter le clic à l'extérieur
    const formRef = useRef(null);

    // Convertir ISO -> datetime-local
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
                .catch(() => {
                    setErrorMessage("Erreur lors du chargement de la tâche");
                    setPopUpNo(true);
                    setTimeout(() => setPopUpNo(false), 2000);
                });
        }
    }, [togglePopup, id]);

    // Fermer le popup si clic en dehors du formulaire
    useEffect(() => {
        if (!togglePopup) return;

        const handleClickOutside = (e) => {
            if (formRef.current && !formRef.current.contains(e.target)) {
                setTogglePopUp(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [togglePopup]);

    const deleteTache = async () => {
        try {
            const reponse = await axios.delete(`http://localhost:8080/api/v1/tache/delete/${id}`);
            setSuccessMessage(reponse.data);
            setPopUpYes(true);
            setPopUpNo(false);
            if (onDelete) onDelete();
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
            <div>
                <button onClick={() => setTogglePopUp(!togglePopup)} className={styles.edit}>
                    <FiEdit3 />
                </button>
                <button onClick={deleteTache} className={styles.delete}>
                    <IoTrashOutline />
                </button>
            </div>

            {togglePopup && (
                <form
                    ref={formRef}
                    onSubmit={(e) => {
                        e.preventDefault();
                        soumission();
                    }}
                    className={styles.formulaire}
                >
                    <label htmlFor="tache" className={styles.mesLabels}>Tâche:</label>
                    <input
                        type="text"
                        id="tache"
                        value={Texte}
                        onChange={(e) => setTexte(e.target.value)}
                        maxLength={255}
                        className={styles.mesInput}
                        
                        />
                    <label htmlFor="statut" className={styles.mesLabels}>Statut: </label>
                    <select id="statut" value={Statut} onChange={(e) => setStatut(e.target.value)} className={styles.mesInput}>
                        <option value="A_FAIRE">À faire</option>
                        <option value="EN_COURS">En cours</option>
                        <option value="FINI">Terminée</option>
                    </select>
                    <label htmlFor="reminder" className={styles.mesLabels}>Ajouter un rappel:</label>
                    <input
                        type="datetime-local"
                        id="reminder"
                        value={Reminder}
                        onChange={(e) => setReminder(e.target.value)}
                        className={styles.mesInput}
                    />
                    <div>
                        <button type="submit">Valider</button>
                    </div>
                </form>
            )}

            {popUpYes && <p style={{ textAlign: "center", color: "green" }}>{successMessage}</p>}
            {popUpNo && <p style={{ textAlign: "center", color: "red" }}>{errorMessage}</p>}
        </>
    );
}

export default ModifierTache;
