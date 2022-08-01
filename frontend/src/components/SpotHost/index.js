import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addImagesToSpot } from "../../store/images";
import { createSpot } from "../../store/spots";
import '../CSS/SpotHost.css'


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
    const [url1, setUrl1] = useState();
    const [url2, setUrl2] = useState();
    const [url3, setUrl3] = useState();
    const [url4, setUrl4] = useState();
    const [url5, setUrl5] = useState();
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    const [show3, setShow3] = useState(false)
    const [show4, setShow4] = useState(false)
    const [show5, setShow5] = useState(false)
    const [numImages, setNumImages] = useState(0);
    const [errors, setErrors] = useState([]);
    const [loaded, setLoaded] = useState(false)



    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);

        const arr = [url1, url2, url3, url4, url5]
        const result = arr.filter(el => el !== undefined)


        dispatch(createSpot({ name, description, address, city, state, country, price }))
        .then((res)=> {
          if(result.length > 0) {
            for (let each of result) {
            dispatch(addImagesToSpot(res.id, each))
            .then(()=> {
              setLoaded(true)
              history.push(`/spots/current`)
              })
              .catch(async (res) => {
                const data = await res.json();
                  if (data && data.errors) {
                    setErrors(data.errors);
                    window.scrollTo(0, 0);
                  }
              })
            }
          }
        })
        .then(()=> {
          if(!result.length) {
            setLoaded(true)
            history.push(`/spots/current`)
          }
          })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors);
                window.scrollTo(0, 0);
              }
          })
    };



    useEffect(()=>{
        if (show1) setNumImages(1);
        if (show2) setNumImages(2);
        if (show3) setNumImages(3);
        if (show4) setNumImages(4);
        if (show5) setNumImages(5);

        setLoaded(true)
    }, [show1, show2, show3, show4, show5, dispatch])


    const handleAddImage = () => {
      if(!show1) {
        setShow1(true)
        return
      }
      if(!show2) {
        setShow2(true)
        return
      }
      if(!show3) {
        setShow3(true)
        return
      }
      if(!show4) {
        setShow4(true)
        return
      }
      if(!show5) {
        setShow5(true)
        return
      }
    }


    return loaded && (
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
          Description{!!errors.length && `: ${description.length} Characters`}
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

        {show1 && (
          <div>
          <div className="formInputfield2">
              Preview Image
          <label>
          <input placeholder='Image url...' type="url" onChange={(e) => {setUrl1(e.target.value)}} required />
          </label>
          <button type='button' className="image-button-sub" onClick={()=>{setShow1(false)}}> - </button>
          </div>
          </div>
        )}

        {show2 && (
          <div className="formInputfield2">
              Image Url
          <label>
          <input placeholder='Image url...' type="url" onChange={(e) => {setUrl2(e.target.value)}} required />
          </label>
          <button type='button' className="image-button-sub" onClick={()=>{setShow2(false)}}> - </button>
          </div>
        )}

        {show3 && (
          <div className="formInputfield2">
              Image Url
          <label>
          <input placeholder='Image url...' type="url" onChange={(e) => {setUrl3(e.target.value)}} required />
          </label>
          <button type='button' className="image-button-sub" onClick={()=>{setShow3(false)}}> - </button>
          </div>
        )}

        {show4 && (
          <div className="formInputfield2">
              Image Url
          <label>
          <input placeholder='Image url...' type="url" onChange={(e) => {setUrl4(e.target.value)}} required />
          </label>
          <button type='button' className="image-button-sub" onClick={()=>{setShow4(false)}}> - </button>
          </div>
        )}

        {show5 && (
          <div className="formInputfield2">
              Image Url
          <label>
          <input placeholder='Image url...' type="url" onChange={(e) => {setUrl5(e.target.value)}} required />
          </label>
          <button type='button' className="image-button-sub" onClick={()=>{setShow5(false)}}> - </button>
          </div>
        )}


        <div className="image-button-div">
          {show1 ? 'Add Another Image' : 'Add Preview Image'} <br/>
        <button
        type='button'
        className="image-button-add"
        onClick={()=>{numImages < 6 && handleAddImage()}}
        > + </button>
        </div>
        <button type="submit" className="saveSpotButton">Submit Location</button>
      </form>
      </>
    )
}


export default SpotHost
