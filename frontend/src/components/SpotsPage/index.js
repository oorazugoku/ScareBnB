import { useEffect, useState, setStyle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots } from '../../store/spots';
import { NavLink } from 'react-router-dom';
import '../CSS/SpotsPage.css'


function SpotsPage() {
    const [loaded, setLoaded] = useState(false)
    const [hover, setHover] = useState()
    const [img, setImg] = useState(0)
    const [showImg, setShowImg] = useState()
    const dispatch = useDispatch()
    const spots = useSelector(state => Object.values(state.spots))

    useEffect(()=>{
        setLoaded(false)
        dispatch(getSpots()).then(() => setLoaded(true))
    }, [dispatch])

    const handleMouseOver = (each) => {
        if (each.Images.length < img) setImg(0)
        setHover(each.id)
    }

    const check = (e) => {
        if (e.target.className !== 'searchImg') {
            e.preventDefault()
        }
    }

    const handleImgScrollRight = (arr) => {
        console.log('array', arr)
        console.log("Before", img)
        if (img < arr.length - 1) {
            setImg(old => old += 1)
        } else {
            setImg(0)
        }
        console.log('After', img)
    }

    const handleImgScrollLeft = (arr) => {
        console.log('array', arr)
        console.log("Before", img)
        if (img === 0) {
            setImg(arr.length - 1)
        }
        else setImg(old => old -= 1)
        console.log('After', img)
    }

    return loaded && (
    <div className='search-container'>
    <div className='search-page'>
        {loaded && spots.map(each => each.Images.length > 0 && (
        <NavLink key={each.id} onMouseOver={()=>handleMouseOver(each)} onClick={check} className='spot-search-result' to={`/spots/${each.id}`}>
            {hover === each.id && (<div className='spot-button-container'>
                <i onClick={()=>handleImgScrollLeft(each.Images)} className="fas fa-angle-left"></i>
                <i onClick={()=>handleImgScrollRight(each.Images)} className="fas fa-angle-right"></i>
            </div>)}
            <img className='searchImg' src={hover === each.id ? each.Images[img].url : each.Images[0].url} />
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
                <b>${parseInt(each.price).toFixed()}</b> night
            </div>
        </NavLink>
        ))}
    </div>
    </div>
    )
}

export default SpotsPage
