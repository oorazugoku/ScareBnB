import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { editSpot } from "../../store/spots";


function EditSpotForm({ setShowModal, spot }) {
  const history = useHistory()
  const dispatch = useDispatch();
  const [name, setName] = useState(spot.name);
  const [description, setDescription] = useState(spot.description);
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [country, setCountry] = useState(spot.country);
  const [price, setPrice] = useState(spot.price);
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);
      dispatch(editSpot({id: spot.id, name, description, address, city, state, country, price}))
      .then(()=>setShowModal(false))
      .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
              setErrors(data.errors);
            }
        })
    };

    return (
      <>
      <button
      type="button"
      className="modalClose"
      onClick={()=>{setShowModal(false)}}
      >
    <h3><i className="fas fa-xmark" /></h3>
      </button>
      <form style={{ padding: "24px" }} onSubmit={handleSubmit} className='signupForm'>
        <div>
          <h2>Spot Edit Page <i className="fas fa-ghost" /></h2>
        </div>
        <ul>
          {!!errors.length && errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <div className="formInputfield">
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
        <div className="formInputfield">
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
        <div className="formInputfield">
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
        <div className="formInputfield">
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
        <div className="formInputfield">
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
        <div className="formInputfield">
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
        <div className="formInputfield">
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
        <button type="submit" className="signupButton">Save Changes</button>
      </form>
      </>
  );
}

export default EditSpotForm;
