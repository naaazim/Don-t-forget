import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import axios from "../api";
import ListeExaminesDansGroupe from "../components/ListesExaminesDansGroupe";
import ListeExaminesPasDansGroupe from "../components/ListeExaminesPasDansGroupe";
import CreationGroupe from "../components/CreationGroupes";
import { useNavigate } from "react-router-dom";

function GestionGroupes() {
    const [groupes, setGroupes] = useState([]);
    const [examines, setExamines] = useState([]);
    const [nonExamines, setNonExamines] = useState([]);
    const [groupeId, setGroupeId] = useState(null);
    const [popupGroupe, setPopupGroupe]=useState(false);
    const [ajout, setAjout]=useState(false);

    const naviguer=useNavigate();
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchGroupes = async () => {
        try {
            let response = await axios.get(`/api/v1/groupe/get-by-user/${userId}`);
            if(user.appUserRole=="ADMIN"){
                 response = await axios.get(`/api/v1/groupe/get-all`);
            }
            setGroupes(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des examens :", error);
        }
    };

    const fetchExamines = async () => {
        if (!groupeId) return;
        try {
            const response = await axios.get(`/api/v1/appartient-groupe/get-users-in/${groupeId}`);
            setExamines(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des examinés :", error);
        }
    };

    const fetchNonExamines = async () => {
        if (!groupeId) return;
        try {
            const response = await axios.get(`/api/v1/appartient-groupe/get-users-not-in/${groupeId}`);
            setNonExamines(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des non-examinés :", error);
        }
    };

    useEffect(() => {
        fetchGroupes();
    }, []);

    useEffect(() => {
        if (groupes.length > 0 && !groupeId) {
            setGroupeId(groupes[0].id);
        }
    }, [groupes]);

    useEffect(() => {
        if (groupeId) {
            fetchExamines();
            fetchNonExamines();
        }
    }, [groupeId]);

    const supprimerDuGroupe = async (id) => {
        try {
            await axios.delete(`/api/v1/appartient-groupe/supprimer/${id}/${groupeId}`);
            await fetchGroupes();
            await fetchExamines();  // 🔄 Rafraîchir après suppression
            await fetchNonExamines();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };
    
    const ajouterGroupe = async (intitule) => {
        try {
            await axios.post(`/api/v1/groupe/create`,{intitule : intitule, createurId : userId});
            await fetchGroupes();
            await fetchExamines();  
            await fetchNonExamines();
            setPopupFalse();
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
        }
    };

    const ajouterdansGroupe = async (id) => {
        try {
            await axios.post(`/api/v1/appartient-groupe/ajouter/${id}/${groupeId}`);
            await fetchGroupes();
            await fetchExamines(); 
            await fetchNonExamines();
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
        }
    };

    const setPopupFalse = ()=>setPopupGroupe(false);

    return (
        <>
            <div style={{paddingLeft:"50px"}}>
                <Navbar title={"Gestion des groupes"} />
            </div>
            <div className='bgImage'></div>
            <div  className="d-flex flex-row align-items-center m-3">
                <h2 className="montserrat m-2 ">Groupe :</h2>
                <select className="border border-warning rounded-3 w-200 p-2" onChange={(e) => setGroupeId(e.target.value)} value={groupeId || ""}>
                    {groupes.map((groupe) => (
                        <option key={groupe.id} value={groupe.id}>{groupe.titre}</option>
                    ))}
                </select>
                <button className="btn btn-outline-primary p-2  rounded-5 m-2 montserrat" onClick={()=>{setAjout(true)}}>Ajouter des examines</button>
                <button className="btn btn-outline-primary p-2  rounded-5 m-2 montserrat" onClick={()=>setPopupGroupe(true)}>Ajouter un groupe</button>
            </div >
                    
            {popupGroupe && <CreationGroupe userId={userId} fonction1={setPopupFalse} fonction2={ajouterGroupe}/>}
            <div className="d-flex flex-row">
            {groupeId && <ListeExaminesDansGroupe examines={examines} fonction={supprimerDuGroupe} />}
            {ajout && <ListeExaminesPasDansGroupe examines={nonExamines} fonction={ajouterdansGroupe} fonction1={()=>setAjout(false)} />}
            </div>
            <button onClick={()=>naviguer("/dashboard-examinateur")} className="position-absolute bg-bleu w-200 p-2 text-white m-2 px-5 py-3 border-0 montserrat rounded-5 bottom-0 end-0">Terminer</button>
        </>
    );
}

export default GestionGroupes;