import React from "react";
import styles from "../style/ConfirmationModal.module.css";

// Composant qui permet d'afficher une pop-up demandant a l'utilisitaur une confirmation avant d'effectuer une action
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p>{message}</p>
        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={onCancel}>Annuler</button>
          <button className={styles.confirm} onClick={onConfirm}>Confirmer</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;