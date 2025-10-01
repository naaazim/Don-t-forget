import { useState, useRef, useEffect } from "react";
import styles from "../style/contact.module.css";
import axios from "../axiosConfig";

function Contact({ id }) {
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [Message, setMessage] = useState("");
    const [popUpError, setPopUpError] = useState(false);
    const [popUpSuccess, setPopUpSuccess] = useState(false);
    const [texte, setTexte] = useState("");
    const [loading, setLoading] = useState(false);

    // Références pour les pop-ups
    const popUpErrorRef = useRef(null);
    const popUpSuccessRef = useRef(null);

    // Fermer les pop-ups si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popUpErrorRef.current &&
                !popUpErrorRef.current.contains(event.target) &&
                popUpError
            ) {
                setPopUpError(false);
            }
            if (
                popUpSuccessRef.current &&
                !popUpSuccessRef.current.contains(event.target) &&
                popUpSuccess
            ) {
                setPopUpSuccess(false);
            }
        };

        // Ajouter l'écouteur d'événement
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Nettoyer l'écouteur d'événement
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popUpError, popUpSuccess]);

    const valide = async () => {
        setLoading(true);
        try {
            setPopUpError(false);
            setPopUpSuccess(false);
            const response = await axios.post("/api/v1/contact", {
                name: Name,
                email: Email,
                message: Message,
            });
            setPopUpSuccess(true);
            setTexte(response.data?.message || "Email envoyé avec succès");
        } catch (err) {
            const errorMessage = err.response?.data || "Erreur lors de l'envoi du mail";
            setTexte(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage));
            setPopUpError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id={id}>
            {popUpError && (
                <div ref={popUpErrorRef} className={`${styles.popUp} ${styles.popUpError}`}>
                    {texte}
                </div>
            )}
            {popUpSuccess && (
                <div ref={popUpSuccessRef} className={`${styles.popUp} ${styles.popUpSuccess}`}>
                    {texte}
                </div>
            )}
            {loading && <div className={styles.loader}>Envoi en cours...</div>}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    valide();
                }}
                className={styles.formulaire}
            >
                <label htmlFor="nom">Nom :</label>
                <input
                    id="nom"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <label htmlFor="email">Email :</label>
                <input
                    id="email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="message">Message :</label>
                <textarea
                    rows={5}
                    id="message"
                    onChange={(e) => setMessage(e.target.value)}
                    required
                ></textarea>
                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Envoi..." : "Envoyer"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Contact;
