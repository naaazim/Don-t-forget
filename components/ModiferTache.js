import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { useState } from "react";
function ModifierTache({id}){
    // const[texte, setTexte] = useState("");
    // const[deadline, setDeadline] = useState("");
    const[Statut, setStatut] = useState("A_FAIRE");
    const[togglePopup, setTogglePopUp] = useState(false);
    const[successMessage, setSuccessMessage] = useState("");
    const[errorMessage, setErrorMessage] = useState("");
    const[popUpNo, setPopUpNo] = useState(false);
    const[popUpYes, setPopUpYes] = useState(false);

    const soumission =  async () => {
        try{
            const reponse = await axios.put(`http://localhost:8080/api/v1/tache/update/${id}`,{
                statut : Statut
            });
            setSuccessMessage(reponse.data.message || "Tâche mise à jour avec succès.");
            setPopUpNo(false);
            setPopUpYes(true);
            setTimeout(()=>{
                setPopUpYes(false);
            },2000);
        }catch(err){
            setErrorMessage(err.response?.data || err.message || "Une erreur est survenue.");
            setPopUpNo(true);
            setPopUpYes(false);
            setTimeout(()=>{
                setPopUpNo(false);
            },2000);
        }
    }

    return (
        <>
            <button onClick={() => {
                setTogglePopUp(true);
            }}>
                <FiEdit/>
            </button>
            {togglePopup &&
                <form onSubmit={(e) => {
                    e.preventDefault();
                    soumission();
                }}>
                    <select onChange={(e) => {
                        setStatut(e.target.value);
                    }}>
                        <option value={"A_FAIRE"}>À faire</option>
                        <option value={"EN_COURS"}>En cours</option>
                        <option value={"FINI"}>Terminée</option>
                    </select>
                    <button type="submit">Valider</button>
                </form>
            }
            {popUpYes && <p style={{textAlign:"center", color:"green"}}>{successMessage}</p>}
            {popUpNo && <p style={{textAlign:"center", color:"red"}}>{errorMessage}</p>}
        </>
    )
}
export default ModifierTache;