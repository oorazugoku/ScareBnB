import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots } from '../../store/spots';
import { useHistory } from 'react-router-dom';
import './SpotsPage.css'
import house from '../../resources/defaulthouse.png'


function SpotsPage() {
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const spots = useSelector(state => Object.values(state.spots))

    const handleClick = (each) => {
        history.push(`/spots/${each.id}`)
    }

    useEffect(()=>{
        setLoaded(false)
        dispatch(getSpots()).then(() => setLoaded(true))
    }, [dispatch])



    return loaded && (
    <div className='search-container'>
    <div className='search-page'>
        {loaded && spots.map(each => each.Images.length > 0 && (
        <div key={each.id} className={'spot-search-result'} onClick={()=> handleClick(each)}>
            <img className='searchImg' src={each.Images[0].url} />
            <div id={`inner-spot-search`}>
                <div id="inner-search-title">
                    <div>
                    <b>{each.city}, {each.state}</b>
                    </div>
                    <div>
                    <i className="fas fa-ghost" /> {parseInt(each.avgStarRating) == 0 ? 'New' : each.avgStarRating}
                    </div>
                </div>
                <p/>
                Aug 1 - 7
                <p/>
                <b>${parseInt(each.price).toFixed()}</b> night
            </div>
        </div>
        ))}
    </div>
    </div>
    )
}

export default SpotsPage
