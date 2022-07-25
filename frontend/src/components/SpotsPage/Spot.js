import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getOneSpot } from "../../store/spots"

function Spot() {
    const { spotId } = useParams()
    const dispatch = useDispatch()

    useEffect(()=> {
        dispatch(getOneSpot(spotId))
    }, [dispatch])

    return (
        <>
        Hello!
        </>
    )
}


export default Spot
