import { TbArrowDownToArc } from "react-icons/tb";
import styles from "../style/navbar.module.css";
import { useState, useRef, useEffect } from "react";

function Navbar() {
    const [aPropos, setAPropos] = useState(false);
    const [fonctionnement, setFonctionnement] = useState(false);

    const aProposRef = useRef(null);
    const fonctionnementRef = useRef(null);

    // Ferme les paragraphes si le curseur sort du li ET du paragraphe
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (aProposRef.current && !aProposRef.current.contains(e.target) && !e.target.closest(`.${styles.aPropos}`)) {
                setAPropos(false);
            }
            if (fonctionnementRef.current && !fonctionnementRef.current.contains(e.target) && !e.target.closest(`.${styles.fonctionnement}`)) {
                setFonctionnement(false);
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            <ul className={styles.liste}>
                {/* À propos */}
                <li
                    ref={aProposRef}
                    onMouseEnter={() => setAPropos(true)}
                >
                    <div style={{display:"flex", alignItems:"center", gap: "10px"}}>
                        À propos <TbArrowDownToArc style={{marginTop:"2px", color:"rgb(59, 124, 243)"}}/>
                    </div>
                    {aPropos && (
                        <p
                            className={styles.aPropos}
                            onMouseEnter={() => setAPropos(true)}
                            onMouseLeave={() => setAPropos(false)}
                        >
                            Don<span style={{ color: "rgb(59, 124, 243)", fontWeight: "bold" }}>’</span>t forget est une application conçue pour vous aider à mieux organiser vos journées.
                            Notre objectif est simple : vous offrir un outil intuitif et agréable qui vous accompagne dans la gestion de vos tâches quotidiennes.
                            <ul className={styles.liste2}>
                                <li>Créer et suivre vos listes de tâches facilement.</li>
                                <li>Organiser vos priorités sans stress.</li>
                                <li>Ne plus rien oublier grâce à un système de rappels.</li>
                                <li>Profiter d’une interface moderne et simple d’utilisation.</li>
                            </ul>
                        </p>
                    )} 
                </li>

                {/* Fonctionnement */}
                <li
                    ref={fonctionnementRef}
                    onMouseEnter={() => setFonctionnement(true)}
                    onClick={() => scrollToSection("fonctionnement")}
                    style={{ cursor: "pointer" }}
                >
                    <div style={{display:"flex", alignItems:"center", gap: "10px"}}>
                        Fonctionnement <TbArrowDownToArc style={{marginTop:"2px", color:"rgb(59, 124, 243)"}}/>
                    </div>
                    {fonctionnement && (
                        <p
                            className={styles.fonctionnement}
                            onMouseEnter={() => setFonctionnement(true)}
                            onMouseLeave={() => setFonctionnement(false)}
                        >
                            Avec Don<span style={{ color: "rgb(59, 124, 243)", fontWeight: "bold" }}>’</span>t Forget, organiser vos journées devient facile :
                            <ul>
                                <li>Créer vos tâches rapidement et facilement.</li>
                                <li>Programmer des rappels pour ne rien oublier.</li>
                                <li>Consulter vos listes à tout moment depuis une interface claire et intuitive.</li>
                            </ul>
                            En quelques clics, vos journées sont mieux organisées et vos tâches toujours sous contrôle.
                        </p>
                    )}
                </li>


                <li>
                    <a href="#contact">Contact <TbArrowDownToArc style={{marginTop:"2px", color:"rgb(59, 124, 243)"}}/></a>
                </li>
            </ul>
        </>
    );
}

export default Navbar;
