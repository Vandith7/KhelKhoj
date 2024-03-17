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
import GroundDetails from './Pages/GroundDetails';
import ActivityDetails from './Pages/ActivityDetails';
import BookingDetails from './Pages/BookingDetails';
import AllBookings from './Pages/AllBookings';
import ClubAllBookings from './Pages/ClubAllBookings';
import UpdateUser from './Pages/UpdateUser';
import UpdateGround from './Pages/UpdateGround';
import ClubGroundDetails from './Pages/ClubGroundDetails';
import ClubActivityDetails from './Pages/ClubActivityDetails';
import UpdateActivity from './Pages/UpdateActivity';
import Wallet from './Pages/Wallet';
import ClubWallet from './Pages/ClubWallet';

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
        <Route path="/groundDetails/:groundId" component={GroundDetails} />
        <Route path="/bookingDetails/:bookingId" component={BookingDetails} />
        <Route path="/activityDetails/:activityId" component={ActivityDetails} />
        <Route path="/allBookings" component={AllBookings} />
        <Route path="/clubAllBookings" component={ClubAllBookings} />
        <Route path="/updateUser" component={UpdateUser} />
        <Route path="/updateGround/:groundId" component={UpdateGround} />
        <Route path="/updateActivity/:activityId" component={UpdateActivity} />
        <Route path="/clubGroundDetails/:groundId" component={ClubGroundDetails} />
        <Route path="/clubActivityDetails/:activityId" component={ClubActivityDetails} />
        <Route path="/wallet" component={Wallet} />
        <Route paath="/clubWallet" component={ClubWallet} />
      </Switch>

    </Router>
  );
}

export default App;
