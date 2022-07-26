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
    const [url, setUrl] = useState([]);
    const [url1, setUrl1] = useState();
    const [url2, setUrl2] = useState();
    const [url3, setUrl3] = useState();
    const [url4, setUrl4] = useState();
    const [url5, setUrl5] = useState();
    const [numImages, setNumImages] = useState(0);
    const [imageArr, setImageArr] = useState([]);
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);


        if (url5) setUrl([url5])
        if (url4) setUrl([url4, url5])
        if (url3) setUrl([url3, url4, url5])
        if (url2) setUrl([url2, url3, url4, url5])
        if (url1) setUrl([url1, url2, url3, url4, url5])

        dispatch(createSpot({ name, description, address, city, state, country, price }))
        .then((res)=> {
          if(url.length > 0) {
            url.forEach(each =>
            dispatch(addImagesToSpot(res.id, each))
            .catch(async (res) => {
              const data = await res.json();
              if (data && data.errors) {
                setErrors(data.errors);
              }
            })
            )
          }
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

    }, [numImages])


    const handleAddImage = () => {
      if(numImages < 5) {
        setNumImages(prevCount => prevCount + 1)
      }
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

        {numImages > 0 && (
          <div className="formInputfield2">
              Image Url
          <label>
          <input placeholder='Image url...' type="text" onChange={(e) => {setUrl1(e.target.value)}} required />
          </label>
          </div>
        )}

        {numImages > 1 && (
          <div className="formInputfield2">
              Image Url
          <label>
          <input placeholder='Image url...' type="text" onChange={(e) => {setUrl2(e.target.value)}} required />
          </label>
          </div>
        )}

        {numImages > 2 && (
          <div className="formInputfield2">
              Image Url
          <label>
          <input placeholder='Image url...' type="text" onChange={(e) => {setUrl3(e.target.value)}} required />
          </label>
          </div>
        )}

        {numImages > 3 && (
          <div className="formInputfield2">
              Image Url
          <label>
          <input placeholder='Image url...' type="text" onChange={(e) => {setUrl4(e.target.value)}} required />
          </label>
          </div>
        )}

        {numImages > 4 && (
          <div className="formInputfield2">
              Image Url
          <label>
          <input placeholder='Image url...' type="text" onChange={(e) => {setUrl5(e.target.value)}} required />
          </label>
          </div>
        )}


        <div className="image-button-div">
          Add a Preview Image <br/>
        <button
        type='button'
        className="image-button"
        onClick={()=>{numImages < 6 && handleAddImage()}}
        > + </button>
        </div>
        <button type="submit" className="saveSpotButton">Submit Location</button>
      </form>
      </>
    )
}


export default SpotHost
