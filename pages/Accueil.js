import styles from "../style/accueil.module.css"
function Accueil(){
    return (
        <>
            <nav className={styles.navigation}>
                <a href="/"><img src = "./logo.png" alt="logo" className={styles.logo}/></a>
                <div className={styles.navigation2}>
                    <a href="./Signup" className={styles.signup}>Inscription</a>
                    <a href="./Login" className={styles.login}>Connexion</a>
                </div>
                
            </nav>
            <h1 className={styles.titre}>Une liste de taches intuitive pour une organisation sans faille</h1>
            <p className={styles.presentation}> 
                Gérer ses tâches devient facile avec Don<span className={styles.apostrophe}>'</span>t Forget, <br/>la plateforme qui simplifie le suivi de votre organisation au quotidien. 
            </p>
        </>
    )
}
export default Accueil;