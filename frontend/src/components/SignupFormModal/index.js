import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import SignupForm from './SignupForm'

function SignupFormModal({showModalSignUp, setShowModalSignUp}) {

  return (
    <>
      {showModalSignUp && (
        <Modal onClose={() => setShowModalSignUp(false)}>
          <SignupForm showModalSignUp={showModalSignUp} setShowModalSignUp={setShowModalSignUp} />
        </Modal>
      )}
    </>
  );
}

export default SignupFormModal;
