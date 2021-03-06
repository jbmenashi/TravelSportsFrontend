import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import './App.css';
import Homepage from './containers/Homepage'
import TripList from './containers/TripList.js'
import NewTrip from './containers/NewTrip'
import Login from './containers/Login'

class App extends Component {
  state = {
    // currentUserId: undefined,
    currentUserId: 27,
    games: [],
    teams: [],
  }

  setUserId = (userId) => {
    this.setState({
      currentUserId: userId
    })
  }


  componentDidMount() {
    fetch("https://travsketball.herokuapp.com/api/v1/games")
    .then(r => r.json())
    .then(data => {
      this.setState({
        games: data
      })
    })

    fetch("https://travsketball.herokuapp.com/api/v1/teams")
    .then(r => r.json())
    .then(data => {
      this.setState({
        teams: data
      })
    })
  }

  createTrip = (gameId, title, hotelId, transportationId) => {
    console.log("hit create trip")
    fetch(`https://travsketball.herokuapp.com/api/v1/users/1/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        game_id: gameId,
        user_id: this.state.currentUserId,
        title: title,
        hotel_id: hotelId,
        transportation_id: transportationId
      })
    })
      .then(r => window.location.href = '/trip-list')


  }

  editTrip = (tripId, title, hotelId, transportationId) => {
    console.log("edit trip:", tripId, title, parseInt(hotelId), parseInt(transportationId))
    fetch(`https://travsketball.herokuapp.com/api/v1/users/1/trips/${tripId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        title: title,
        hotel_id: parseInt(hotelId),
        transportation_id: parseInt(transportationId)
      })
    })
    .then(window.location.href = '/trip-list')
    .then( <Redirect to="/trip-list"/>)
  }

  deleteTrip = (tripId) => {
    fetch(`https://travsketball.herokuapp.com/api/v1/users/1/trips/${tripId}`, {
      method: "DELETE"
    })
    .then(window.location.href = '/trip-list')
    // .then( <Redirect to="/trip-list"/>)
  }

  // showLinks = () => {
  //   return  <>
  //             <Link to="/">Home</Link>
  //             <Link to="/new-trip">New Trip</Link>
  //             <Link to="/trip-list">Trip List</Link>
  //           </>
  // }


  render() {

    return (
      <Router>
        <>
        <div className="custom-nav">
          <div className="container">
            <div className="row">
              <div className="col">
                <h1>Travsketball</h1>
                <nav className="nav-links">
                  {/* {this.state.currentUserId && this.showLinks()} */}
                  <Link to="/">Home</Link>
                  <Link to="/new-trip">New Trip</Link>
                  <Link to="/trip-list">Trip List</Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Route path="/" exact render={props => <Homepage currentUserId={this.state.currentUserId} setUserId={this.setUserId}/>} />

          <Route path="/new-trip/" render={props => <NewTrip teams={this.state.teams} games={this.state.games} createTrip={this.createTrip} />} />
          <Route path="/trip-list" render={props => <TripList currentUserId={this.state.currentUserId} editTrip={this.editTrip} deleteTrip={this.deleteTrip}/> } />
        </div>
        </>
      </Router>
    );
  }
}

export default App
