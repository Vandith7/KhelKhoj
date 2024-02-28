import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Welcome from './Pages/Welcome';
import ClubRegister from './Pages/ClubRegister';
import ClubLogin from './Pages/ClubLogin';
import UserRegister from './Pages/UserRegister';
import UserLogin from './Pages/UserLogin';
import WelcomeUser from './Pages/WelcomeUser';
import WelcomeClub from './Pages/WelcomeClub';
import AddGround from './Pages/AddGround';
import AddActivities from './Pages/AddActivities';

function App() {
  return (

    <Router>

      <Switch>
        <Route path="/" exact component={Welcome} />
        <Route path="/clubRegister" component={ClubRegister} />
        <Route path="/clubLogin" component={ClubLogin} />
        <Route path="/userRegister" component={UserRegister} />
        <Route path="/userLogin" component={UserLogin} />
        <Route path="/welcomeUser" component={WelcomeUser} />
        <Route path="/welcomeClub" component={WelcomeClub} />
        <Route path="/addGround" component={AddGround} />
        <Route path="/addActivity" component={AddActivities} />
      </Switch>

    </Router>
  );
}

export default App;
