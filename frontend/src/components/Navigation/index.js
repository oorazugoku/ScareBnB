import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import '../CSS/Navigation.css';
import scare from '../../resources/scare.png'

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='Nav-Container'>
      <div className='Nav-Container-inner'>

        <div className='logo-area'>
          <NavLink className='logo-text' exact to="/"><i className="fas fa-ghost" /> <img className='logo' src={scare}/></NavLink>
        </div>

        {isLoaded && (<ProfileButton user={sessionUser} />)}

      </div>
    </div>
  );
}

export default Navigation;
