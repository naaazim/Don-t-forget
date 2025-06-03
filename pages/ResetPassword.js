import axios from "axios";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "../style/resetPassword.module.css";
function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmedNewPassword, setConfirmedNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const confirm = async () => {
        if (newPassword !== confirmedNewPassword) {
            setMessage("❌ Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8080/api/v1/reset-password?token=${token}`,
                {
                    newPassword: newPassword,
                }
            );
            setMessage("✅ " + response.data);
        } catch (error) {
            setMessage("❌" + error.response?.data || "Une erreur est survenue");
        }
    };

    return (
        <>
            <a href="/"><img src="/logo.png" alt="logo" className={styles.logo}/></a>
            <h1 className={styles.titre}>Modifier le mot de passe</h1>
            {message && <p style={{textAlign:"center"}}>{message}</p>}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    confirm();
                }}
                className={styles.formulaire}
            >
                <label htmlFor="newPass">Nouveau mot de passe</label>
                <input
                    type="password"
                    placeholder="Entrez votre nouveau mot de passe"
                    id="newPass"
                    required
                    maxLength={255}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <label htmlFor="newPass2">Confirmez votre mot de passe</label>
                <input
                    type="password"
                    placeholder="Confirmez votre nouveau mot de passe"
                    id="newPass2"
                    required
                    maxLength={255}
                    onChange={(e) => setConfirmedNewPassword(e.target.value)}
                />

                <button type="submit">Valider</button>
            </form>

        </>
    );
}

export default ResetPassword;
