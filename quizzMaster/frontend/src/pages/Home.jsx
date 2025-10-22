import styles from '../style/accueil.module.css'

function Home() {
  return (<>
  <div className="BG_GRADIENT"></div>
    <div className={styles.accueil}>
      <nav className={styles.navigation}>
        <a href="/"><img src="LOGO.png" alt="logo" style={{width:"120px",marginTop:"20px"}}/></a>
        <span className={styles.navbar1}>
          <a href="#1" className={styles.lien}>A PROPOS</a>
          <a href="#2" className={styles.lien}>POURQUOI NOUS ?</a>
          <a href="#3" className={styles.lien}>FONCTIONNEMENT</a>
        </span>
        <span className={styles.navbar2}>
          <a href="/Login" className={styles.connexion}>CONNEXION</a>
          <a href="/Signup" className={styles.inscription}>INSCRIPTION</a>
        </span>
      </nav>

      <p className={styles.simplifiez}>Simplifiez la gestion de <br/>vos examens en ligne</p>
      
      <p className={styles.explications}>Une plateforme intuitive et sécurisée pour créer, analyser et corriger vos <br/>examens en toute simplicité.</p>

      <p className={styles.qui} id="1">QUI SOMMES <span className={styles.nous}>NOUS</span> ?</p>

      <div className={styles.image}>
      <img src="/LOGO.png" alt="logo" className={styles.logo}/>
      </div>

      <div className={styles.zbib}>
        <div className={styles.container2}>
          <p>QuizzMaster est une plateforme web conviviale spécialisée dans la gestion et la correction des examens en ligne.</p>
          </div>
          </div>
          <div className={styles.containerStat}>
          <div>
          <p className={styles.pourQui}>POUR <span className={styles.quii}>QUI</span> ?</p>
          <p className={styles.vousEtes}>Vous êtes chef d'entreprise ? Enseignant ? <br/> Il vous est aujourd'hui nécessaire d'avoir <br/>accés à certaines technologies dans le <br />cadre du recrutement ou de l'evaluation <br />vous permettant d'économiser: <br />TEMPS/ARGENT <br /><span className={styles.quizzMaster} >QuizzMaster</span> est votre solution !</p>
          </div>
          <img src="quiz.png" alt="statistiques" className={styles.pourPhoto}/>
          </div>

      <p className={styles.pourquoiNous} id="2">POURQUOI <span className= {styles.hna}>NOUS</span> ?</p>

      <div className={styles.containerWhy}>
        <p className={styles.parapgrapheInterface}>Plus besoin de connaissances techniques poussées pour créer vos examens, QuizzMaster est conçue pour vous permettre de construire ce que vous désirez sans aucune aide.</p>
       <div className={styles.containerWhyPhoto}>
        <img src="DOIGT.png" alt="curseur" className={styles.stat}/>
        <p className={styles.nehiLvista}>Interface conviviale</p>
        </div>
      </div>

      <div className={`${styles.containerWhy} ${styles["bg-jaune"]}`}>
      <div className={styles.containerWhyPhoto}>
        <img src="PERF.png" alt="curseur" className={styles.stat}/>
        <p className={styles.nehiLvista}>Analyse et gestion du temps</p>
        </div>
        <p className={styles.parapgrapheInterface}>Gestion de paramétrages du temps passé pour répondre aux questions et analyse automatique des performances et du temps de réponse des candidats.</p>

        
      </div>
      <div className={`${styles.containerWhy} ${styles["bg-orange"]}`}>
        <p className={styles.parapgrapheInterface}>Vous n’avez plus a gérer la correction des examens, cette dernière se fait automatiquement et immédiatement.</p>
       <div className={styles.containerWhyPhoto}>
        <img src="BRAIN.png" alt="curseur" className={styles.stat}/>
        <p className={styles.nehiLvista}>Automatisation des notes</p>
        </div>
      </div>
      
      <p className={styles.decouvrez} id="3">DECOUVREZ NOTRE <br /><span className={styles.decouvrezOrange}>FONCTIONNEMENT</span></p>
      
      <p className={styles.pourLes}>POUR LES <span className={styles.examinateur}>EXAMINATEURS</span></p>

      <div className={styles.maDiv}> 
        <p className={styles.n1}>1</p>
        <span className={styles.creerExamen}>CREER UN EXAMEN</span>
        <p className={styles.n1}>2</p>
        <span className={styles.creerExamen}>CREER UN GROUPE</span><br />
      </div> 

      <div className={styles.maDiv}>
        <p className={styles.n1}>3</p>
        <span className={styles.creerExamen}>ASSIGNER UN EXAMEN</span>
        <p className={styles.n1}>4</p>
        <span className={styles.corriger}>CORRIGER SI LES REPONSES SONT LIBRES</span>
      </div>

      <p className={styles.pourLesE}>POUR LES <span className={styles.examine}>EXAMINÉS</span></p>

      <div className={styles.maDiv}> 
        <p className={styles.n2}>1</p>
        <span className={styles.Examine}>SELECTIONNER UN EXAMEN</span>
        <p className={styles.n2}>2</p>
        <span className={styles.Examine}>PASSER L'EXAMEN</span><br />
      </div> 

      <div className={styles.maDiv3}>
        <p className={styles.ehOui}>EH  OUI ! <br />C'EST AUSSI <span className={styles.simple}>SIMPLE</span> QUE ÇA</p>
        <img src="LOGO.png" alt="logo" className={styles.logo}/>
        <a href="/Signup"className={styles.commencer}>COMMENCER</a>
      </div>

      </div>
      </>
  )
}
export default Home;
