import axios from "axios";
import { useState } from "react";
import styles from "../style/forgotPassword.module.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const confirm = async () => {
        setMessage("");

        try {
            const response = await axios.post("http://localhost:8080/api/v1/mot-de-passe-oublie", {
                email: email,
            });

            setMessage("✅ " + response.data);
        } catch (error) {
            setMessage("❌ " + (error.response?.data || "Une erreur est survenue"));
        }
    };

    return (
        <div>
            <a href="/"><img src = "./logo.png" alt="logo" className={styles.logo}/></a>
            <h1 className={styles.titre}>Modifier le mot de passe</h1>
            {message && <p style={{textAlign:"center"}}>{message}</p>}
            <form onSubmit={(e) => {
                    e.preventDefault();
                    confirm();
                }}
                className={styles.formulaire}
            >
                <label htmlFor="email">Adresse email :</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Entrez votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Envoyer le lien</button>
            </form>
        </div>
    );
}

export default ForgotPassword;
