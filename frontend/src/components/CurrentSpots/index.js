import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { getCurrentSpots } from "../../store/spots"

function CurrentSpots() {
    const history = useHistory()
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch()
    const spots = useSelector(state => Object.values(state.spots))

    const handleClick = (each) => {
        history.push(`/spots/${each.id}`)
    }

    useEffect(()=> {
        dispatch(getCurrentSpots()).then(() => setLoaded(true))
    }, [dispatch])

    return (
        <>
        <div className="host-header-outer">
        <div className='host-header'>
          <h1>Your current Locations <i className="fas fa-ghost" id='ghost' /></h1>
        </div>
        </div>
        <div style={{ margin: '230px 0 0 0 '}} className='search-page'>
        {loaded && spots.map(each => (
        <div key={each.id} className={'spot-search-result'} onClick={()=> handleClick(each)}>
            <img className='searchImg' src={'https://cdn.hauntedrooms.com/wp-content/uploads/2018/01/olde-park-hotel-ballinger.jpg'} />
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
                <b>${each.price}</b> night
            </div>
        </div>
        ))}
    </div>
        </>
    )
}


export default CurrentSpots
