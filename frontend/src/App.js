import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormModal from "./components/SignupFormModal";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsPage from "./components/SpotsPage";
import Spot from "./components/SpotsPage/Spot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="root-div">
      <Navigation isLoaded={isLoaded} />
        <Switch>
          <Route path="/signup">
            <SignupFormModal />
          </Route>
          <Route path="/spots/:spotId">
            <Spot />
          </Route>
          <Route exact path="/">
            <SpotsPage />
          </Route>
        </Switch>
    </div>
  );
}

export default App;
