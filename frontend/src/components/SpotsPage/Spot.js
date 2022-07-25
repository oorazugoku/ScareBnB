import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getOneSpot } from "../../store/spots"

function Spot() {
    const [isLoaded, setIsLoaded] = useState(false);
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const spot = useSelector(state => state.spots)
    const user = useSelector(state => state.session.user)

    useEffect(()=> {
        dispatch(getOneSpot(spotId)).then(() => setIsLoaded(true))
    }, [dispatch])

    return isLoaded && (
        <>
        <div className="spot-container">
            <div className="spot-header">
                <h1>{spot.description}</h1>
                <i className="fas fa-ghost" /> {spot.avgStarRating} · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'} · {spot.city}, {spot.state}, {spot.country}
            {user && user.id === spot.Owner.id && (
            <>
                <button
                className="spot-edit-button"
                >
                    Edit Spot
                </button>
                <button
                className="spot-delete-button"
                >
                    Delete Spot
                    </button>
            </>
            )}
            </div>
            <div type='button' className="spot-images">
                {spot.Images.map(each => (
                    <img key={each.id} src={each.url} />
                ))}
            </div>
            <div className="spot-hostInfo">
                {spot.name} hosted by {spot.Owner.firstName}
            </div>
            <div className="spot-reviews">
                Reviews
            </div>
        </div>
        </>
    )
}


export default Spot
