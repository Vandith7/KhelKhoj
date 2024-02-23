import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Welcome from './Pages/Welcome';
import ClubRegister from './Pages/ClubRegister';
import ClubLogin from './Pages/ClubLogin';
import UserRegister from './Pages/UserRegister';
import UserLogin from './Pages/UserLogin';
import WelcomeUser from './Pages/WelcomeUser';
import Activities from './Pages/Activities';

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
        <Route path="/activities" component={Activities} />
      </Switch>

    </Router>
  );
}

export default App;
