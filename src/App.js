import React, { Component } from "react";
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
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
    document.title = "Recipi"

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
            this.saveToken("")
          }
        });
    }
  }
  saveToken(token) {
    console.log("saveToken is called with token: "+token)
    localStorage.setItem('tokenItem', token)
    this.setState({ token: token })
  }
  render() {
    return (
      <Router>
        <div className="App">
          <header id="headerClick" style={{ backgroundColor: "#6dc4ed" }}>
            <h1 onClick={()=>{
                window.location.href = '/'
              }} className="Recipi"> Recipi </h1>
          </header>
          <body style={{ backgroundColor: "#e6f5fc", color: "#1c7fad", fontFamily: "Quicksand" }}>
            <Route exact path="/" render={() => (
              <Redirect to="/home"/>
            )} />
            <Route exact path="/login" render={(routeProps) => (
              <LoginForm {...routeProps} token={this.state.token} saveToken={this.saveToken} />
            )} />
            <Route exact path="/home" render={(routeProps) => (
              <Home {...routeProps} token={this.state.token} saveToken={this.saveToken} />
            )} />
            <br></br>
          </body>
          <footer style={{ backgroundColor: "#6dc4ed" }}>Website built by Nicolai Antonov, 2019</footer>
        </div>
      </Router>
    )
  }
}

export default App;
