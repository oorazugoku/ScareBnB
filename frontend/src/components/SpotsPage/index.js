import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots } from '../../store/spots';
import { NavLink, useHistory } from 'react-router-dom';
import './SpotsPage.css'


function SpotsPage() {
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const spots = useSelector(state => Object.values(state.spots))
    
    const handleClick = (each) => {
        history.push(`/spots/${each.id}`)
    }

    useEffect(()=>{
        dispatch(getSpots()).then(() => setLoaded(true))
    }, [dispatch])


    return (
    <>
    <div className='search-page'>
        {loaded && spots.map(each => (
        <div key={each.id} className={'spot-search-result'} onClick={()=> handleClick(each)}>
            <img className='searchImg' src={each.Images.length > 0 ? each.Images[0].url : null} />
            <div id={`inner-spot-search`}>
                <div id="inner-search-title">
                    <b>{each.city}, {each.state}</b>
                    <i className="fas fa-ghost" /> {each.avgStarRating}
                    </div>
                <p/>
                Aug 1 - 7
                <p/>
                <b>${each.price}</b> night
            </div>
        </div>
        ))}
    </div>
    </>
    )
}

export default SpotsPage
