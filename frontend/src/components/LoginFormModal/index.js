import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import LoginFormPage from '../LoginFormPage';

function LoginFormModal({setShowMenu}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => {setShowModal(true)}}>Log In</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <LoginFormPage setShowModal={setShowModal} setShowMenu={setShowMenu} showModal={showModal} />
        </Modal>
      )}
    </>
  );
}

export default LoginFormModal;
