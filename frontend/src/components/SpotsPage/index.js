import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import { getSpots } from '../../store/spots';
import './SpotsPage.css'


function SpotsPage() {
    // const [spots, setSpots] = useState([])
    const [test, setTest] = useState()
    const dispatch = useDispatch()

    useEffect(()=>{
        // setSpots([])
        dispatch(getSpots())
    }, [dispatch])

    const spots = useSelector(state => state.spots)
    console.log('testing....', spots)

    return (
        <>
    <div className='search-page'>
        {spots.result && spots.result.length > 0 && spots.result.map(each => (
            <div key={each.id} className={'spot-search-result'}>
                <img className='searchImg' src="https://cdn.hauntedrooms.com/wp-content/uploads/2018/01/olde-park-hotel-ballinger.jpg" />
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
