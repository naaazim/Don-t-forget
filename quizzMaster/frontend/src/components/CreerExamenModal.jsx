import React, { useState } from "react";
import axios from "../api";
import styles from "../style/CreerExamenModal.module.css";

const CreerExamenModal = ({ onClose, onCreate }) => {
  const [intitule, setIntitule] = useState(""); // Etat qui va gerer le champ intitulé de l'examen il est initialisé a vide
  const [noteMax, setNoteMax] = useState(20); // Etat qui va gerer le champ Note initialisé a 20
  const [errors, setErrors] = useState({}); // Etat pour gerer les erreurs champ vide et note<=0 et les messages d'erreurs

  // Fonction qui va gerer la soumission de création de l'examen
  const handleSubmit = async () => {

    //Initialisation d'une constante errors qui va contenir les erreurs
    const newErrors = {};

    // Si l'utilisateur essaye de créer un examen sans intitulé, un champ intitule de newErrors va etre crée avec le message d'erreur associé
    if (intitule.trim() === "") {
      newErrors.intitule = "L'intitulé ne peut pas être vide.";
    }

    // Ici meme chose pour la note si l'utilisateur entre une note<=0 un champ noteMax est crée avec son message d'erreur
    if (noteMax <= 0) {
      newErrors.noteMax = "La note doit être supérieure à 0.";
    }

    // Vérifie s'il y a au moins un élément dans newErrors, si oui bloque la création
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      await axios.post(
        `/api/v1/examens/create/${userId}`,
        {
          intitule: intitule,
          note_max: noteMax,
        }
      );
      onCreate();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création :", error);
    }
  };

  return (
    <div className={styles.modal}>
      <h3>Création Examen</h3>

      <div className={styles["form-group"]}>
        <label><strong>Intitulé :</strong></label>
        <input
          type="text"
          value={intitule}
          onChange={(e) => {
            setIntitule(e.target.value);
            setErrors((prev) => ({ ...prev, intitule: "" }));
          }}
        />
        {errors.intitule && (
          <p className={styles.error}>{errors.intitule}</p>
        )}
      </div>

      <div className={styles["form-group"]}>
        <label><strong>Note sur :</strong></label>
        <input
          type="number"
          min="1"
          value={noteMax}
          onChange={(e) => {
            setNoteMax(e.target.value);
            setErrors((prev) => ({ ...prev, noteMax: "" }));
          }}
        />
        {errors.noteMax && (
          <p className={styles.error}>{errors.noteMax}</p>
        )}
      </div>

      <div className={styles["modal-actions"]}>
        <button className={styles["bt-annuler"]} onClick={onClose}>Annuler</button>
        <button className={styles["bt-valider"]} onClick={handleSubmit}>Terminer</button>
      </div>
    </div>
  );
};

export default CreerExamenModal;