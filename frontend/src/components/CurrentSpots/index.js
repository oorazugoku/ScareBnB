import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { getCurrentSpots } from "../../store/spots"
import house from '../../resources/defaulthouse.png'


function CurrentSpots() {
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch()
    const spots = useSelector(state => Object.values(state.spots))



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
        <NavLink key={each.id} className='spot-search-result' to={`/spots/${each.id}`}>
            <img className='searchImg' src={each.Images.length > 0 ? each.Images[0].url : house} />
            <div id={`inner-spot-search`}>
                <div id="inner-search-title">
                    <div>
                    <b>{each.city.length < 15 ? each.city : `${each.city[0]}${each.city[1]}${each.city[3]}${each.city[4]}${each.city[5]}${each.city[6]}${each.city[7]}${each.city[8]}${each.city[9]}${each.city[10]}${each.city[11]}${each.city[12]}...`}, {each.state.length < 15 ? each.state : `${each.state[0]}${each.state[1]}${each.state[3]}${each.state[4]}${each.state[5]}${each.state[6]}${each.state[7]}${each.state[8]}${each.state[9]}${each.state[10]}${each.state[11]}${each.state[12]}...`}</b>
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
        </NavLink>
        ))}
    </div>
    </div>
    </>
    )
}


export default CurrentSpots
