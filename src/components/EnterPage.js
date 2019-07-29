import React from 'react';
import { Redirect, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap';


class EnterPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      token: this.props.token,
      isLoggedIn: false,
      isLoading: true
    }
  }
  componentDidMount() {
    //verify token; if valid, redirect to home
    //otherwise, redirect to login
    this.setState({isLoading: true})
    fetch('/api/account/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          this.setState({
            isLoggedIn: true,
            isLoading: false
          });
        } else {
          this.setState({
            isLoggedIn: false,
            isLoading: false
          });
        }
      });
  }
  render() {
    if (this.state.isLoading) {
      return <Container><div className="text-center"><h2>Loading ...</h2></div></Container>
    }
    //check if a token exists
    if (this.state.token) {
      //if it exists, and verification is successful, redirect to home
      if (this.state.isLoggedIn) {
        return (
          <div>
            <Redirect to="/home" />
          </div>
        )
      //otherwise, prompt user to login/authenticate
      } else {
        console.log("happen1")
        return (
          <div>
            <Redirect to="/login" />
          </div>
        );
      }
      //if no token is provided, prompt user to login/authenticate
    } else if (this.state.token == "") {
      console.log("happen2")
      return (
        <div>
          <Redirect to="/login" />
        </div>
      )
    }
    return <Container><div className="text-center"><h2>Loading ...</h2></div></Container>
  }
}

export default EnterPage