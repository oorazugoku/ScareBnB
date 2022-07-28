import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import './LoginForm.css'

function LoginFormPage({ setShowModal }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  if (sessionUser) return (
    <Redirect to="/" />
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  }

  return (
    <div className='formContainer'>
      <button
      type="button"
      className="modalClose"
      onClick={()=>{setShowModal(false)}}>
      <i className="fas fa-xmark" />
      </button>
    <form onSubmit={handleSubmit} className='loginForm'>
      <div>
        <h2>Login to ScareBnB <i className="fas fa-ghost" /></h2>
      </div>
      <ul>
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      
      <div className='formInputfield'>
      <label>
        Username or Email: <input
          id='input'
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
          />
      </label>
      </div>

      <div className='formInputfield'>
      Password
      <label>
        <input
          id='input'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      </div>
      <p>
      <button id='loginSubmitButton' type="submit">Log In</button>
      </p>
    </form>
    </div>
  );
}

export default LoginFormPage;
