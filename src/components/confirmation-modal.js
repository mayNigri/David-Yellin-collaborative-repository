import React from 'react';
import './confirmation-modal.css';

const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>X</button>
        <div className="modal-content">
          <p>{message}</p>
          <button className="popUp-button" onClick={onConfirm}>Confirm</button>
          <button className="popUp-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
