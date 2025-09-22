import axios from "../axiosConfig";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../style/resetPassword.module.css";
import { RiEyeCloseLine, RiEyeFill } from "react-icons/ri";

function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmedNewPassword, setConfirmedNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const confirm = async () => {
        if (newPassword !== confirmedNewPassword) {
            setMessage("❌ Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await axios.put(
                `/api/v1/reset-password?token=${token}`,
                {
                    newPassword: newPassword,
                }
            );
            setMessage("✅ " + response.data);
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            setMessage("❌" + (error.response?.data || "Une erreur est survenue"));
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
                <div className={styles["password-container"]}>
                    <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Entrez votre nouveau mot de passe"
                        id="newPass"
                        required
                        maxLength={255}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span
                        className={styles["password-toggle"]}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                        {showNewPassword ? <RiEyeFill size={20}/> : <RiEyeCloseLine size={20}/>}
                    </span>
                </div>

                <label htmlFor="newPass2">Confirmez votre mot de passe</label>
                <div className={styles["password-container"]}>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmez votre nouveau mot de passe"
                        id="newPass2"
                        required
                        maxLength={255}
                        onChange={(e) => setConfirmedNewPassword(e.target.value)}
                    />
                    <span
                        className={styles["password-toggle"]}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <RiEyeFill size={20}/> : <RiEyeCloseLine size={20}/>}
                    </span>
                </div>

                <button type="submit">Valider</button>
            </form>
        </>
    );
}

export default ResetPassword;
