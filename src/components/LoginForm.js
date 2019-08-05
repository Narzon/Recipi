import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { Redirect, Route } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap';


class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      username: "",
      isLoading: true,
      signUpError: "",
      registerForm: false,
      token: this.props.token,
      validSession: false,
      toHome: false
    };
  }

  //make sure user has provided both inputs
  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  //methods handle whether or not to render the registration form
  register = event => {
    this.setState({ registerForm: true })
  }
  backToLogin = event => {
    this.setState({ registerForm: false })
  }
  //attempt to login
  handleLogin = event => {
    this.setState({ isLoading: true })
    event.preventDefault();
    const {
      email,
      password,
    } = this.state;
    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then(res => res.json())
      .then(json => {
        //if server cannot authenticate, alert user
        if (!json.success) {
          this.setState({
            signUpError: json.message
          })
          alert("invalid login")
          this.setState({ isLoading: false })
        ///otherwise, save token to state and localstorage and attempt to send user to home
        } else {
          this.props.saveToken(json.token)
          localStorage.setItem('tokenItem', json.token);
          this.setState({ toHome: true, isLoading: false })
        }

      });
  }
  //attempt to register new user
  handleSubmit = event => {
    this.setState({ isLoading: true })
    event.preventDefault();
    const {
      email,
      password,
      username
    } = this.state;
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        username: username
      }),
    }).then(res => res.json())
      .then(json => {
        //if registration is successful, alert user to success and return to login
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            email: '',
            password: '',
            username: ''
          });
          this.setState({ registerForm: false })
        } else {
        //if registration is unsuccessful (doe to username or email being taken already), alert use to try again
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
          alert("Username or email taken! Try again.")
        }
      });

  }
  componentDidMount() {
    this.setState({ isLoading: true })
    //on mounting, attempt to validate any current token in state
    fetch('/api/account/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            validSession: true
          });
        } else {
          this.setState({
            validSession: false
          });
        }
        this.setState({ isLoading: false })
      });
    
  }
  render() {
    //if successful login is indicated, return to entrypage with new token
    if (this.state.toHome) {
      return <Redirect to='/home' />
    }
    //display Loading ... if appropriate
    if (this.state.isLoading) {
      return (
        <Container style={{height: "900px"}}> <div className="text-center"><h2 className="text-center">Loading ... </h2> </div></Container>
      )
    }
    //if it exists in state, render a registration form instead of login
    if (this.state.registerForm) {
      return (
        <Container style={{height: "900px"}}>
          <div className="Login">
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="email" bsSize="large">
                <FormLabel>Email  </FormLabel>
                <FormControl
                  autoFocus
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup controlId="username" bsSize="large">
                <FormLabel>Username  </FormLabel>
                <FormControl
                  value={this.state.username}
                  onChange={this.handleChange}
                  type="username"
                />
              </FormGroup>
              <FormGroup controlId="password" bsSize="large">
                <FormLabel>Password  </FormLabel>
                <FormControl
                  value={this.state.password}
                  onChange={this.handleChange}
                  type="password"
                />
              </FormGroup>
              <Button
                block
                bsSize="large"
                disabled={!this.validateForm()}
                type="submit"
                variant="info"
              >
                Register
            </Button>
              <br></br>
              <Button
                block
                bsSize="small"
                type="submit"
                variant="info"
                onClick={this.backToLogin}
              >
                Go Back
            </Button>

            </form>
          </div>
        </Container>
      );
    }
    //if there is no token currently in state, or if there is a token that fails authentication, render the login form
    if (!this.state.token || this.state.validSession === false) {
      return (
        <Container style={{height: "900px"}}>
          <div>
            <p>Login here: </p>
            <form onSubmit={this.handleLogin}>
              <FormGroup controlId="email" bsSize="large">
                <FormLabel>Email  </FormLabel>
                <FormControl
                  autoFocus
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup controlId="password" bsSize="large">
                <FormLabel>Password  </FormLabel>
                <FormControl
                  value={this.state.password}
                  onChange={this.handleChange}
                  type="password"
                />
              </FormGroup>
              <Button
                block
                bsSize="large"
                disabled={!this.validateForm()}
                type="submit"
                variant="info"
              >
                Login
                </Button>

            </form>
            <br></br>


            <Button
              block
              bsSize="large"
              type="button"
              variant="info"
              onClick={this.register}>
              Register
          </Button>
          </div>
        </Container>
      )
    }
    //by default, send user to home (assumes authentication has not failed)
    return (
      <div>
        <p>Signed in</p>
        <div><Redirect to="/home" /></div>
      </div>
    );
  }

}

export default LoginForm