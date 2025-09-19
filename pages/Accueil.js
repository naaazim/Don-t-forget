import styles from "../style/accueil.module.css";
import { useNavigate } from "react-router-dom";
import { LuCircleArrowRight } from "react-icons/lu";
import Navbar from "../components/Navbar";
function Accueil(){
    const navigate = useNavigate();
    const date = new Date();
    return (
        <>
            <nav className={styles.navigation}>
                <a href="/"><img src = "./logo.png" alt="logo" className={styles.logo}/></a>
                <Navbar/>
                <div className={styles.navigation2}>
                    <a href="./Signup" className={styles.signup}>Inscription</a>
                    <a href="./Login" className={styles.login}>Connexion</a>
                </div>
                
            </nav>
            <h1 className={styles.titre}>Une liste de taches intuitive pour une organisation sans faille</h1>
            <p className={styles.presentation}> 
                Gérer ses tâches devient facile avec Don<span className={styles.apostrophe}>'</span>t Forget, <br/>la plateforme qui simplifie le suivi de votre organisation au quotidien. 
            </p>
            <div className={styles.division}>
                <button
                    onClick={() => {
                        navigate("/login");
                    }}
                >
                    <span>Commencer</span>
                    <LuCircleArrowRight className={styles.fleche}/>
                </button>
            </div>

            <footer>
                <p className={styles.footer}>© {date.getFullYear()} Don<span style={{color:"rgb(59, 124, 243)"}}>'</span>t Forget. All rights reserved.</p>
            </footer>
        </>
    )
}
export default Accueil;