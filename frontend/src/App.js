import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormModal from "./components/SignupFormModal";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsPage from "./components/SpotsPage";
import Spot from "./components/SpotsPage/Spot";
import SpotHost from "./components/SpotHost";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="root-div">
      <div className='Nav-absolute'>
      <Navigation isLoaded={isLoaded} />
      </div>
      <div className="divider" />
        <Switch>
          <Route exact path="/">
            <SpotsPage />
          </Route>
          <Route exact path="/signup">
            <SignupFormModal />
          </Route>
          <Route exact path="/spots/host">
            <SpotHost />
          </Route>
          <Route exact path="/spots/:spotId">
            <Spot />
          </Route>
        </Switch>
    </div>
  );
}

export default App;
