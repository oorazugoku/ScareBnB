import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import SignupForm from './SignupForm'

function SignupFormModal({setShowMenu}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button className="menu-button" onClick={() => setShowModal(true)}>Sign Up</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <SignupForm setShowModal={setShowModal} showModal={showModal} setShowMenu={setShowMenu} />
        </Modal>
      )}
    </>
  );
}

export default SignupFormModal;
