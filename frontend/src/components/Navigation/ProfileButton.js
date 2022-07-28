import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { NavLink, useHistory, Redirect, Route, useLocation } from "react-router-dom";
import * as sessionActions from '../../store/session';
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { login } from "../../store/session";

function ProfileButton({ user }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation()
  const local = location.pathname
  const [showModalLogin, setShowModalLogin] = useState(false)
  const [showModalSignUp, setShowModalSignUp] = useState(false)


// Menu Open -------------------------
const openMenu = () => {
  if (showMenu) return;
  setShowMenu(true);
};

useEffect(() => {
  if (!showMenu) return;

  const closeMenu = () => {
      setShowMenu(false);
  };

  document.addEventListener('click', closeMenu)

  return () => document.removeEventListener("click", closeMenu);
}, [showMenu]);
// ------------------------------------



  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout())
    .then(() => {
      if (local === '/spots/current') {
        history.push('/')
      }
    })
    .then(()=>setShowMenu(false));
  };

  const handleDemoClick = () => {
      dispatch(login({
        credential: 'DemoUser',
        password: 'password'
      }))
      .then(() => setShowMenu(false))
      .then(() => {
        if (local === '/') {
          history.push('/spots/current')
        }
      })  }

  return (
    <>
    {(
      <>
      <LoginFormModal showModalLogin={showModalLogin} setShowModalLogin={setShowModalLogin} />
      <SignupFormModal showModalSignUp={showModalSignUp} setShowModalSignUp={setShowModalSignUp} />
      </>
    )}
    <div className="right-nav-buttons">
    {!user && (
      <>
      <button className="demo-user-button" onClick={handleDemoClick}>Demo User</button>
      </>
    )}
    {user && (<NavLink className='become-host' to='/spots/host'>Become a Host</NavLink>)}
      <button className="profile-button" onClick={openMenu}>
      <i className="fas fa-bars"/> <i className="fas fa-user-circle"/>
      </button>
      {showMenu && (
        <div className="profile-dropdown-container">
        <div className="profile-dropdown">
          {!user && (
            <>
            <NavLink className="menu-link" onClick={()=> setShowModalLogin(true)} to=''>Log In</NavLink><p/>
            <NavLink className="menu-link" onClick={()=> setShowModalSignUp(true)} to=''>Sign Up</NavLink><p/>
          </>
          )}
          {user && (
          <>
          <div className="user-section">
          <div className="menu-text">{user.username}</div>
          <div className="menu-text">{user.email}</div>
          </div>
          <p/>
          <NavLink className="menu-link" to='/spots/current'>My Spots</NavLink><p/>
          <div>
          <NavLink className="menu-link" to='/' onClick={logout}>Logout</NavLink><br/>
          </div>
          </>
          )}
        </div>
        </div>
      )}
    </div>
    </>
  );
}

export default ProfileButton;
