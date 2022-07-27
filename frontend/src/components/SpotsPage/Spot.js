import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useParams, Redirect } from "react-router-dom"
import { deleteSpot, getOneSpot } from "../../store/spots"
import { Modal } from '../../context/Modal';
import EditSpotForm from "../EditSpotModal";

function Spot() {
    const history = useHistory()
    const [showModal, setShowModal] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const spot = useSelector(state => state.spots)
    const user = useSelector(state => state.session.user)

    useEffect(()=> {
        dispatch(getOneSpot(spotId)).then(() => setIsLoaded(true))
    }, [dispatch, isLoaded])

    const handleDeleteClick = () => {
        setIsLoaded(false)
        dispatch(deleteSpot(spotId))
        .then(() => history.push('/spots/current'))
        .then(() => setIsLoaded(true))

    }

    return isLoaded && (
        <>
        <div className="spot-container">
            <div className="spot-header">
                <div>
                <h1>{spot.description}</h1>
                <p/>
                <i className="fas fa-ghost" /> {parseInt(spot.avgStarRating) == 0 ? 'New' : spot.avgStarRating} · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'} · {spot.city}, {spot.state}, {spot.country}
                </div>
            {user && user.id === spot.Owner.id && (
            <div className="owner-spot-buttons">
                <button
                className="spot-edit-button"
                onClick={() => setShowModal(true)}
                >
                    Edit Spot
                </button>
                <button
                className="spot-delete-button"
                onClick={()=> {handleDeleteClick()}}
                >
                    Delete Spot
                </button>
            </div>
            )}
            </div>
            <div className="grid-container">
                <div type='button' className="spot-images">
                    {spot.Images.map((each, i) => i < 5 && (<div key={each.id} className={`spotImage${i + 1}`}><img src={each.url} /></div>))}
                    {spot.Images.length < 1 && (<div>Upload an Image</div>)}
                </div>
            </div>
            <div className="spot-lowerInfo">
            <div className="spot-hostInfo">
                {spot.name} hosted by {spot.Owner.firstName}
                    <div className="spot-reviews">
                    Reviews
                    </div>
            </div>
            <div className="spot-booking">
                <div className="spot-booking-price">
                    <div>
                    <span className='spot-booking-bigText'>${parseInt(spot.price)}</span> night
                    </div>
                        <div className="spot-booking-reviews">
                            <i className="fas fa-ghost" />&nbsp;{parseInt(spot.avgStarRating) == 0 ? 'New' : spot.avgStarRating} · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}
                        </div>
                </div>
                <p />
                <div className="spot-booking-price-breakdown">
                    <p className="spot-booking-price-breakdown-text">You won't be charged yet</p>
                    <div className="spot-booking-price-breakdown-left">
                    ${parseInt(spot.price)} x 5 nights <p />
                    Cleaning fee <p />
                    Service fee <p />
                    </div>
                    <div className="spot-booking-price-breakdown-right">
                    ${(parseInt(spot.price) * 5).toLocaleString()}<p />
                    ${(((parseInt(spot.price) * 5) * .06).toFixed()).toLocaleString()} <p />
                    ${(((parseInt(spot.price) * 5) * .1).toFixed()).toLocaleString()} <p />
                    </div>
                    <div className="spot-booking-price-breakdown-divider"></div>
                </div>
                    <div className="spot-booking-totals">
                        <div>
                            Total before taxes
                        </div>
                        <div className="spot-booking-totals2">
                            ${(parseInt(parseInt(spot.price) * 5) + parseInt(((parseInt(spot.price) * 5) * .06).toFixed()) + parseInt(((parseInt(spot.price) * 5) * .1).toFixed())).toLocaleString()}
                        </div>
                    </div>



            </div>
            </div>
        </div>
        {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <EditSpotForm setShowModal={setShowModal} spot={spot} setIsLoaded={setIsLoaded} />
        </Modal>)}
        </>
    )
}


export default Spot
