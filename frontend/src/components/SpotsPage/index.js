import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import { getSpots } from '../../store/spots';
import { NavLink } from 'react-router-dom';
import './SpotsPage.css'
import Spot from './spot';


function SpotsPage() {
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getSpots())
    }, [dispatch])

    const spots = useSelector(state => Object.values(state.spots))
    console.log('testing....', spots)

    const handleClick = (each) => {
        console.log('clicky')
        return (<NavLink to={'/spot/:spotId'} />)
    }

    return (
        <>
    <div className='search-page'>
        {spots && spots.length > 0 && spots.map(each => (
        <div key={each.id} className={'spot-search-result'} onClick={()=> handleClick(each)}>
                <img className='searchImg' src={each.Images.length > 0 ? each.Images[0].url : null} />
                <div id={`inner-spot-search`}>
                    <div id="inner-search-title">
                        <h3>{each.city}, {each.state}</h3>
                        <i className="fas fa-ghost" /> {each.avgStarRating}
                    </div>
                <p />
                Aug 1 - 7
                <p/>
                <b>${each.price}</b> night
                </div>
            </div>
        )
        )}
    </div>
        </>
    )
}

export default SpotsPage
