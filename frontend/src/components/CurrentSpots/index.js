import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { getCurrentSpots } from "../../store/spots"
import house from '../../resources/defaulthouse.png'


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
        <div className="one">
        <div className="host-header-outer">
        <div className='host-header'>
          <h1>Your current Locations <i className="fas fa-ghost" id='ghost' /></h1>
        </div>
        </div>
        <div style={{ margin: '230px 0 0 0 '}} className='search-page'>
        {loaded && spots.map(each => (
        <div key={each.id} className={'spot-search-result'} onClick={()=> handleClick(each)}>
            <img className='searchImg' src={each.Images.length > 0 ? each.Images[0].url : house} />
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
                <b>${each.price}</b> night
            </div>
        </div>
        ))}
    </div>
    </div>
    </>
    )
}


export default CurrentSpots
