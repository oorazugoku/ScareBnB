import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useParams, NavLink } from "react-router-dom"
import { addReview, deleteReview, getSpotReviews, editReview } from "../../store/reviews"
import { deleteSpot, getOneSpot } from "../../store/spots"

function Spot() {
    const history = useHistory()
    const [isLoaded, setIsLoaded] = useState(false);
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const spot = useSelector(state => state.spots)
    const user = useSelector(state => state.session.user)
    const reviews = useSelector(state => Object.values(state.reviews))
    const [postReview, setPostReview] = useState(false)
    const [editReviewShow, setEditReviewShow] = useState(false)
    const [review, setReview] = useState('')
    const [errors, setErrors] = useState([]);
    const [numStars, setNumStars] = useState()
    const [reviewId, setReviewId] = useState()

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        const payload = {
            review,
            stars: numStars
        }
        dispatch(addReview(spotId, payload))
        .then(()=>{
            setIsLoaded(false)
            setPostReview(false)
            setEditReviewShow(false)
            setIsLoaded(true)
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors);
            }
        })
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        const payload = {
            review,
            stars: numStars
        }
        setIsLoaded(false)
        dispatch(editReview(reviewId, payload))
        .then(()=>{
            setPostReview(false)
            setEditReviewShow(false)
            setIsLoaded(true)
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors);
            }
        })
    };


    const handleDeleteReview = (id) => {
        if (window.confirm('Are you sure you want to Delete?')) {
            setIsLoaded(false)
            dispatch(deleteReview(id))
            .then(() => {
                dispatch(getSpotReviews(spotId))
            })
            .then(() => {
                setPostReview(false)
                setEditReviewShow(false)
                setIsLoaded(true)
            })
        }
    }

    useEffect(()=> {
        dispatch(getOneSpot(spotId))
        .then(() => {
            dispatch(getSpotReviews(spotId))
            .then(() => setIsLoaded(true))
        })
        if(!user) {
            setPostReview(false)
            setEditReviewShow(false)
        }
    }, [dispatch, isLoaded, user])

    const handleDeleteSpot = () => {
        if (window.confirm('Are you sure you want to Delete?')) {
            setIsLoaded(false)
            dispatch(deleteSpot(spotId))
            .then(() => history.push('/spots/current'))
            .then(() => setIsLoaded(true))
        }
    }
    let imgClassName
    if (spot.Images && spot.Images.length >= 5) {
        imgClassName = "spot-images"
    }
    if (spot.Images && spot.Images.length === 4) {
        imgClassName = "spot-images4"
    }
    if (spot.Images && spot.Images.length === 3) {
        imgClassName = "spot-images3"
    }
    if (spot.Images && spot.Images.length === 2) {
        imgClassName = "spot-images2"
    }
    if (spot.Images && spot.Images.length === 1) {
        imgClassName = "spot-images1"
    }


    return isLoaded && (
        <>
        <div className="one">
        <div className="spot-container">
            <div className="spot-header">
                <div>
                <h1>{spot.description}</h1>
                <p/>
                <i className="fas fa-ghost" /> {parseInt(spot.avgStarRating) == 0 ? 'New' : spot.avgStarRating} · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'} · {spot.city}, {spot.state}, {spot.country}
                </div>
            {user && user.id === spot.Owner.id && (
            <div className="owner-spot-buttons">
                <NavLink to={`/spots/${spot.id}/edit`}>
                <button
                className="spot-edit-button"
                >
                    Edit Spot
                </button>
                </NavLink>
                <button
                className="spot-delete-button"
                onClick={()=> {handleDeleteSpot()}}
                >
                    Delete Spot
                </button>
            </div>
            )}
            </div>
            <div className="grid-container">
                <div type='button' className={imgClassName}>
                    {spot.Images.map((each, i) => i < 5 && (<div key={each.id} className={`spotImage${i + 1}`}><img src={each.url} /></div>))}
                    {spot.Images.length < 1 && (<div>&nbsp;&nbsp;&nbsp;&nbsp;Upload an Image to have your spot on the Front Page!</div>)}
                </div>
            </div>
            <div className="spot-lowerInfo">
                <div className="spot-lowerInfo-left">
                    <div className="spot-hostInfo">
                        {spot.name} hosted by {spot.Owner.firstName}
                    </div>
                    <div className="post-review">


                     {user && user.id && (<button className="post-review-button" onClick={()=>{setPostReview(!postReview); setEditReviewShow(false); setReview(''); setErrors([]);}}>Post a Review</button>)}<p/>
                     {user && postReview && (
                        <div className="post-review-container">
                        <div className="stars-container">
                            <button className="num-stars-button" onClick={() => setNumStars(1)}><i className="fas fa-ghost"/></button>
                            <button className="num-stars-button" onClick={() => setNumStars(2)}><i className="fas fa-ghost"/></button>
                            <button className="num-stars-button" onClick={() => setNumStars(3)}><i className="fas fa-ghost"/></button>
                            <button className="num-stars-button" onClick={() => setNumStars(4)}><i className="fas fa-ghost"/></button>
                            <button className="num-stars-button" onClick={() => setNumStars(5)}><i className="fas fa-ghost"/></button>
                        </div>
                        <form onSubmit={handleSubmit} className='signupForm'>
                        <ul>
                          {!!errors.length && errors.map((error, idx) => <li key={idx}>{error}</li>)}
                        </ul>
                        <div><b>{numStars}</b> Ghost Rating</div>
                        <div style={{height: '130px'}} className="formInputfield">
                          <b>Review</b>
                          <label>
                            <textarea
                              style={{ height: '100px', width: '500px', border:'0', outline: 'none', overflow: 'auto', resize: 'none' }}
                              placeholder={review}
                              type="text"
                              value={review}
                              onChange={(e) => setReview(e.target.value)}
                              required />
                          </label>
                        </div>

                        <button type="submit" className="signupButton" >Post Review</button>
                        </form>
                        </div>
                     )}

                    {user && editReviewShow && (
                        <div className="edit-review-container">
                        <div className="stars-container">
                            <button className="num-stars-button" onClick={() => setNumStars(1)}><i className="fas fa-ghost"/></button>
                            <button className="num-stars-button" onClick={() => setNumStars(2)}><i className="fas fa-ghost"/></button>
                            <button className="num-stars-button" onClick={() => setNumStars(3)}><i className="fas fa-ghost"/></button>
                            <button className="num-stars-button" onClick={() => setNumStars(4)}><i className="fas fa-ghost"/></button>
                            <button className="num-stars-button" onClick={() => setNumStars(5)}><i className="fas fa-ghost"/></button>
                        </div>
                        <form onSubmit={handleEditSubmit} className='signupForm'>
                        <ul>
                          {!!errors.length && errors.map((error, idx) => <li key={idx}>{error}</li>)}
                        </ul>
                        <div><b>{numStars}</b> Ghost Rating</div>
                        <div style={{height: '130px'}} className="formInputfield">
                          <b>Review</b>
                          <label>
                            <textarea
                              style={{ height: '100px', width: '500px', border:'0', outline: 'none', overflow: 'auto', resize: 'none' }}
                              placeholder={review}
                              type="text"
                              value={review}
                              onChange={(e) => setReview(e.target.value)}
                              required />
                          </label>
                        </div>

                        <button type="submit" className="signupButton">Save</button>
                        </form>
                        </div>
                     )}


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
                </div><p/>
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


                <div className="spot-reviews-container">
                    <div className="spot-reviews-title">
                    <i className="fas fa-ghost" /> {parseInt(spot.avgStarRating) == 0 ? 'New' : spot.avgStarRating} · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}<p/>
                    </div>
                    <div className="spot-reviews">
                        {reviews.map(each => {
                            const date = new Date(each.createdAt)
                            const options = { month: 'long'};
                            const month = new Intl.DateTimeFormat('en-US', options).format(date)
                            const year = date.getFullYear()
                            return (<div key={each.id} className="each-review">
                                        <div className="review-owner">
                                            {each.User.firstName}
                                        </div>
                                        <div className="review-date">
                                            {month} {year}
                                        </div>
                                        <div className="review-body">
                                            {each.review}
                                        </div>
                                        <div className="review-edit">
                                            {user && user.id === each.userId && (
                                            <>
                                            <button className="review-edit-button" onClick={() => {
                                                setErrors([]);
                                                setEditReviewShow(!editReviewShow);
                                                setReviewId(each.id);
                                                setReview(each.review);
                                                setPostReview(false)} }>Edit</button>
                                            <button className="review-delete-button" onClick={() => { handleDeleteReview(each.id) } }>Delete</button>
                                            </>
                                            )}
                                        </div>
                                    </div>)
                        })}
                    </div>
                </div>
        </div>
        </div>
        </>
    )
}


export default Spot
