import { TbArrowDownToArc } from "react-icons/tb";
import styles from "../style/navbar.module.css";
import { useState } from "react";

function Navbar(){
    const [aPropos, setAPropos] = useState(false);
    const [fonctionnement, setFonctionnement] = useState(false);

    return(
        <>
            <ul className={styles.liste}>
                <li onMouseEnter={
                    ()=>{setAPropos(true)}
                }
                onMouseLeave={
                    ()=>{setAPropos(false)}
                }
                >A propos <TbArrowDownToArc/></li>
                {aPropos &&(<p className={styles.aPropos}>Don<span style={{color:"rgb(59, 124, 243)", fontWeight:"bold"}}>’</span>t forget est une application conçue pour vous aider à mieux organiser vos journées.
                Notre objectif est simple : vous offrir un outil intuitif et agréable qui vous accompagne dans la gestion de vos tâches quotidiennes.       
                Avec Don<span style={{color:"rgb(59, 124, 243)", fontWeight:"bold"}}>’</span>t forget, vous pouvez :<br/>
                <ul>
                    <li>Créer et suivre vos listes de tâches facilement.</li>
                    <li>Organiser vos priorités sans stress.</li>
                    <li>Ne plus rien oublier grâce à un système de rappels.</li>
                    <li>Profiter d’une interface moderne et simple d’utilisation.</li>
                </ul>
                Nous croyons que la productivité ne doit pas être compliquée. Don<span style={{color:"rgb(59, 124, 243)", fontWeight:"bold"}}>’</span>t forget est pensé pour être rapide, efficace et accessible, afin que vous puissiez vous concentrer sur ce qui compte vraiment.</p>)}
                <li 
                    onMouseEnter={() => setFonctionnement(true)}
                    onMouseLeave={() => setFonctionnement(false)}
                >Fonctionnement<TbArrowDownToArc/></li>
                {fonctionnement && (
                        <p className={styles.fonctionnement}>
                            Avec Don<span style={{color:"rgb(59, 124, 243)", fontWeight:"bold"}}>’</span>t Forget, organiser vos journées devient facile :<br/>
                            <ul>
                                <li>Créer vos tâches rapidement et facilement.</li>
                                <li>Programmer des rappels pour ne rien oublier.</li>
                                <li>Consulter vos listes à tout moment depuis une interface claire et intuitive.</li>
                            </ul>
                            En quelques clics, vos journées sont mieux organisées et vos tâches toujours sous contrôle.
                        </p>
                    )}
                <li><a href="#contact">Contact</a><TbArrowDownToArc/></li>
            </ul>

        </>
    )
}
export default Navbar;