import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useParams, Redirect } from "react-router-dom"
import { deleteSpot, getOneSpot } from "../../store/spots"
import { Modal } from '../../context/Modal';
import EditSpotForm from "../EditSpotModal";
import house from '../../resources/defaulthouse.jpg'

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
    }, [dispatch])

    const handleDeleteClick = () => {
        dispatch(deleteSpot(spotId))
        history.push('/spots/current')
    }

    const houseImg = (
        <>
        <img src={house}/>
        </>
    )
    
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
            </>
            )}
            </div>
            <div type='button' className="spot-images">
                {spot.Images.map(each => (<img key={each.id} src={each.url} />))}
                {spot.Images.length < 1 && houseImg}
            </div>
            <div className="spot-hostInfo">
                {spot.name} hosted by {spot.Owner.firstName}
            </div>
            <div className="spot-reviews">
                Reviews
            </div>
        </div>
        {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <EditSpotForm setShowModal={setShowModal} spot={spot} />
        </Modal>)}
        </>
    )
}


export default Spot
