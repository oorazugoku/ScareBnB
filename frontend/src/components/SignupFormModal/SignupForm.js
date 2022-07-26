import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import './SignupForm.css'

function SignupFormPage({ setShowModal }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;





  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, password, firstName, lastName }))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
      }
      return setErrors(['Confirm Password field must be the same as the Password field']);
    };

    return (
      <>
      <button type="button" className="modalClose" onClick={()=>{setShowModal(false)}}>
        <i className="fas fa-xmark" />
      </button>
      <form style={{ padding: "24px" }} onSubmit={handleSubmit} className='signupForm'>
        <div>
          <h2>Welcome to ScareBnB <i className="fas fa-ghost" /></h2>
        </div>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <div className="formInputfield">
          First Name
          <label>
            <input
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required />
          </label>
        </div>
        <div className="formInputfield">
          LastName
          <label>
            <input
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required />
          </label>
        </div>
        <div className="formInputfield">
          Email
          <label>
            <input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
          </label>
        </div>
        <div className="formInputfield">
          Username
          <label>
            <input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required />
          </label>
        </div>
        <div className="formInputfield">
          Password
          <label>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
          </label>
        </div>
        <div className="formInputfield">
          Confirm Password
          <label>
            <input
              className="CPInput focus-visible"
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required />
          </label>
        </div>
        <button type="submit" className="signupButton">Sign Up</button>
      </form>
      </>
  );
}

export default SignupFormPage;
