import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots } from '../../store/spots';
import { useHistory } from 'react-router-dom';
import './SpotsPage.css'
import house from '../../resources/defaulthouse.jpg'


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
            <img className='searchImg' src={each.Images.length > 0 ? each.Images[0].url : house} />
            <div id={`inner-spot-search`}>
                <div id="inner-search-title">
                    <div>
                    <b>{each.city}, {each.state}</b>
                    </div>
                    <div>
                    <i className="fas fa-ghost" /> {each.avgStarRating}
                    </div>
                </div>
                <p/>
                Aug 1 - 7
                <p/>
                <b>${each.price.toFixed(0)}</b> night
            </div>
        </div>
        ))}
    </div>
    </>
    )
}

export default SpotsPage
