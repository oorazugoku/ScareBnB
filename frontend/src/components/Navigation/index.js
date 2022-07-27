import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';
import SignupFormModal from '../SignupFormModal';
import scare from '../../resources/scare.png'

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <>
        <LoginFormModal />
        <SignupFormModal />
      </>
    );
  }

  return (
    <div className='Nav-Container'>
      <div className='Nav-Container-inner'>

        <div className='logo-area'>
          <NavLink className='logo-text' exact to="/"><i className="fas fa-ghost" /> <img className='logo' src={scare}/></NavLink>
        </div>

        <div>
          <ul>
            <li className='Nav-links'>
              {isLoaded && sessionLinks}
            </li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}

export default Navigation;
