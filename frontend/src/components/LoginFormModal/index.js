import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import LoginFormPage from '../LoginFormPage';

function LoginFormModal({showModalLogin, setShowModalLogin}) {

  return (
    <>
      {showModalLogin && (
        <Modal onClose={() => setShowModalLogin(false)}>
          <LoginFormPage showModalLogin={showModalLogin} setShowModalLogin={setShowModalLogin} />
        </Modal>
      )}
    </>
  );
}

export default LoginFormModal;
