import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import * as sessionActions from '../../store/session';
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { login } from "../../store/session";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);


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

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);
// ------------------------------------


  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout()).then(()=>setShowMenu(false));
  };

  const handleDemoClick = () => {
      dispatch(login({
        credential: 'DemoUser',
        password: 'password'
      })).then(()=>setShowMenu(false))
  }

  return (
    <>
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
          <LoginFormModal setShowMenu={setShowMenu}/>
          <br/>
          <SignupFormModal setShowMenu={setShowMenu}/>
          </>
          )}
          {user && (
            <>
          <NavLink className='my-spots-link' to='/spots/current'>My Spots</NavLink>
          <div>{user.username}</div>
          <div>{user.email}</div>
          <div>
            <button onClick={logout}>Log Out</button>
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
