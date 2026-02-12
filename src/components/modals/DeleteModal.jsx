import { AlertTriangle, Check, X } from 'lucide-react';
import './deleteModal.css';

const DeleteModal = ({ pokemonName, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <AlertTriangle size={48} className="warning-icon" />
          <h2 className="modal-title">Confirmer la suppression</h2>
        </div>

        <p className="modal-description">
          Êtes-vous sûr de vouloir supprimer<br />
          <strong>{pokemonName}</strong> ?<br />
          Cette action est irréversible.
        </p>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            <X size={18} />
            Annuler
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            <Check size={18} />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
