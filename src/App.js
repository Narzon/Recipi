import React, { Component } from "react";
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import EnterPage from './components/EnterPage'
import LoginForm from './components/LoginForm'
import Home from './components/Home'

class App extends Component {
  constructor() {
    super()
    this.state = {
      token: ""
    };
    this.saveToken = this.saveToken.bind(this);
  }
  componentDidMount() {

    //check if there exists a token in localStorage already, and if so, try to verify it
    if (this.state.token === "" && localStorage.getItem('tokenItem')) {
      //start by saving localStorage token to state
      var newToken = localStorage.getItem('tokenItem');
      this.setState({ token: newToken })
    } else if (this.state.token) {
      fetch('/api/account/verify', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': this.state.token
        }
      }).then(res => res.json())
        .then(json => {
          if (json.success) {
            //if token is valid, continue using it
            console.log("token is valid")
          } else {
            //otherwise, clear local storage and state 
            localStorage.setItem('tokenItem', "");
            this.setState({
              token: ""
            });
          }
        });
    }
  }
  saveToken(token) {
    this.setState({ token: token })
  }
  render() {
    return (
      <Router>
        <div className="App">
          <header style={{ backgroundColor: "#9be0d1" }}>
            <h1 className="Recipi"> Recipi </h1>
          </header>
          <body style={{ backgroundColor: "#dff5f0", color: "#49786e" }}>
            <Route exact path="/" render={(routeProps) => (
              <EnterPage {...routeProps} token={this.state.token} saveToken={this.saveToken} />
            )} />
            <Route exact path="/login" render={(routeProps) => (
              <LoginForm {...routeProps} token={this.state.token} saveToken={this.saveToken} />
            )} />
            <Route exact path="/home" render={(routeProps) => (
              <Home {...routeProps} token={this.state.token} saveToken={this.saveToken} />
            )} />
            <br></br>
          </body>
          <footer style={{ backgroundColor: "#9be0d1" }}>Website built by Nicolai Antonov, 2019</footer>
        </div>
      </Router>
    )
  }
}

export default App;
