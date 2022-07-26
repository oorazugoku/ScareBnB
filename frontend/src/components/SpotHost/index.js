import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addImagesToSpot } from "../../store/images";
import { createSpot } from "../../store/spots";
import './SpotHost.css'


function SpotHost() {
    const history = useHistory()
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [price, setPrice] = useState('');
    const [url, setUrl] = useState('')
    const [numImages, setNumImages] = useState(0);
    const [imageArr, setImageArr] = useState([])
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);

       const spot = dispatch(createSpot({ name, description, address, city, state, country, price }))
        .then(()=> {
          url.forEach(each => {
            dispatch(addImagesToSpot(spot.id, each))
          })
        })
        .then(()=>history.push('/spots/current'))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors);
              }
          })
      };


    useEffect(()=>{
      if(numImages > imageArr.length && numImages < 6) {
        const newDiv = [...imageArr, { id: numImages }]
          setImageArr(newDiv)
      }
    }, [numImages])

    const handleAddImage = () => {
      setNumImages(prevCount => prevCount + 1)
    }


    return (
        <>
        <div className='host-header'>
        <div>
          <h2>Become a 'G'host <i className="fas fa-ghost" id='ghost' /></h2>
        </div>
        </div>
        <form style={{ margin: "200px 0 0 0" }} onSubmit={handleSubmit} className='signupForm'>

        <ul>
          {!!errors.length && errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <div className="formInputfield2">
          Spot Name
          <label>
            <input
              placeholder={name}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required />
          </label>
        </div>
        <div className="formInputfield2">
          Description
          <label>
            <input
              placeholder={description}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required />
          </label>
        </div>
        <div className="formInputfield2">
          Address
          <label>
            <input
              placeholder={address}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required />
          </label>
        </div>
        <div className="formInputfield2">
          City
          <label>
            <input
              placeholder={city}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required />
          </label>
        </div>
        <div className="formInputfield2">
          State
          <label>
            <input
              placeholder={state}
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required />
          </label>
        </div>
        <div className="formInputfield2">
          Country
          <label>
            <input
              placeholder={country}
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required />
          </label>
        </div>
        <div className="formInputfield2">
          Price
          <label>
            <input
              placeholder={price}
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required />
          </label>
        </div>
        {numImages > 0 && imageArr.map(each => (
          <div key={each.id} className="formInputfield2">
              Image Url
          <label>
          <input placeholder={url} type="text" value={url} onChange={(e) => setUrl(old => [...old, e.target.value])} required />
          </label>
          </div>
        ))}
        <div className="image-button-div">
          Add an Image <br/>
        <button
        type='button'
        className="image-button"
        onClick={()=>{handleAddImage()}}
        > + </button>
        </div>
        <button type="submit" className="saveSpotButton">Submit Location</button>
      </form>
      </>
    )
}


export default SpotHost
