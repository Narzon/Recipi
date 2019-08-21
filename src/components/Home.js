import React from 'react';
import { Redirect } from 'react-router-dom'
import { Container, Row, Form, Button } from 'react-bootstrap';
import PostRecipe from './PostRecipe'
import Map from "./Map"
import ChangeRating from "./methods/ChangeRating"
import ShowDesc from "./methods/ShowDesc"
import LoadRecipes from "./methods/LoadRecipes"
import LoadRandomRecipe from "./methods/LoadRandomRecipe"
import LoadRecipeFromMap from "./methods/LoadRecipeFromMap"


class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      token: this.props.token,
      isLoggedIn: false,
      userData: "",
      recipes: [],
      logout: false,
      isLoading: true,
      inputRecipe: "",
      recipeDescription: "",
      searchTerm: "",
      recipeTitleByIndex: [],
      filtRecipes: [],
      myRecipes: [<h3>Nothing to show!</h3>],
      showMyRecipes: false,
      toggleMyRecipesText: "Show My Recipis",
      showMap: false,
      redirectLogin: false
    }
    this.goLogin = this.goLogin.bind(this)
    this.goBack = this.goBack.bind(this);
    this.showInput = this.showInput.bind(this);
    this.changeRating = ChangeRating.bind(this);
    this.showDesc = ShowDesc.bind(this)
    this.loadRecipes = LoadRecipes.bind(this)
    this.loadRandomRecipe = LoadRandomRecipe.bind(this);
    this.toggleMyRecipes = this.toggleMyRecipes.bind(this);
    this.toggleMap = this.toggleMap.bind(this);
    this.loadRecipeFromMap = LoadRecipeFromMap.bind(this);
  }

  componentDidMount() {
    //verify token
    this.setState({ isLoading: true })
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
            isLoggedIn: true,
            userData: json.userData.userName,
            isLoading: false
          });
          this.loadRecipes(this)
        } else {
          //if token is not present or invalid, load user as Guest
          this.setState({
            isLoggedIn: false,
            userData: "Guest",
            isLoading: false
          });
          this.loadRecipes(this)
        }
      });

  }
  // use a new search term being entered to filter which recipes are displayed
  handleSearch = (event) => {
    let newSearch = ""
    if (event) {
      newSearch = event.target.value
      this.setState({
        searchTerm: newSearch
      });
    } else {
      //if this method is being called from a context without any event, continue using existing search term
      newSearch = this.state.searchTerm
    }

    //convert search term to lowercase
    let lcSearch = newSearch.toLowerCase()
    let allRecipes = this.state.recipes
    //map over all recipes
    let newFiltRecipes = allRecipes.map((recipe) => {
      let compareTitle = this.state.recipeTitleByIndex[recipe.key]
      //if title of recipe includes the search term, return it to the new filtered array
      if (compareTitle.includes(lcSearch)) {
        return recipe
      } else {
        return <div></div>
      }
    })
    this.setState({ filtRecipes: newFiltRecipes })
  }
  //method capitalizes first letter of all words, used for titles etc.
  capitalize_Words(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }
  //method capitalizes only the first letter in a string, used for descriptions etc.
  jsUcfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  //function to pass into other components props, used to return to main page
  goBack(doRefresh) {
    if (doRefresh) {
      this.loadRecipes(this)
    }
    this.setState({ inputRecipe: "" })
  }
  //allows user to toggle only their submitted recipes
  toggleMyRecipes() {
    if (this.state.showMyRecipes) {
      this.setState({ showMyRecipes: false, toggleMyRecipesText: "Show My Recipis" })
    } else {
      this.setState({ showMyRecipes: true, toggleMyRecipesText: "Show All Recipis" })
    }
  }
  //toggles Google Map feature on or off
  toggleMap() {
    if (this.state.showMap) {
      this.setState({ showMap: false })
    } else {
      this.setState({ showMap: true })
    }
  }
  //method renders an input form for new recipes
  showInput() {
    this.setState({ inputRecipe: true })
  }
  //logs user out of current session
  logout(token) {
    this.setState({ isLoading: true })
    //NOW STATELESS - simply clear token from client-side
    this.props.saveToken("")
    this.setState({ logout: true, isLoggedIn: false, isLoading: false })

  }
  //relocate user to login/registration page
  goLogin() {
    this.setState({ redirectLogin: true})
  }
  
  render() {
    //if content is loading, display Loading ... screen
    if (this.state.isLoading) {
      return <Container style={{ height: "900px" }}> <div className="text-center"><h2 className="text-center">Loading ... </h2> </div></Container>
    }
    //if a description exists in state, display that component
    if (this.state.recipeDescription) {
      return this.state.recipeDescription
    }
    //after logging out of session, return to entry page
    if (this.state.logout) {
      return <Redirect to='/' />
    }
    //if users clicks login/registration, redirect them appropriately
    if (this.state.redirectLogin) {
      return <Redirect to='/login' />
    }
    //if inputform is true in state, display that component
    if (this.state.inputRecipe) {
      return <Container><div className="row align-items-center justify-content-center"><PostRecipe user={this.state.userData} token={this.state.token} goBack={this.goBack} /></div></Container>
    }
    //render map if toggled on
    if (this.state.showMap) {
      return <div className="text-center" style={{ height: "900px", margin: "0px" }}><Button className="btn" style={{ margin: "5px" }} variant="info" onClick={this.toggleMap}>Toggle Map</Button><br></br><Map loadRecipeFromMap={this.loadRecipeFromMap} oldSelf={this} token={this.state.token} /></div>
    }
    //check for token
    if (this.state.token && this.state.isLoggedIn) {
      //if token is valid and user successfully authenticates, display main recipes page for user
      let displayedRecipes = ""
      //if there is currently a non-empty search term string, only display filtered recipes
      if (this.state.searchTerm !== "") {
        displayedRecipes = <Row>{this.state.filtRecipes}</Row>
      } else {
        displayedRecipes = <Row>{this.state.recipes}</Row>
      }
      if (this.state.showMyRecipes) {
        displayedRecipes = <Row>{this.state.myRecipes}</Row>
      }
      return (
        <div>
          <Container>
            <h3 className="text-center"> Welcome {this.state.userData}, check out these Recipis!</h3>
            <Form onSubmit={(e) => { e.preventDefault() }}>
              <Form.Group controlId="formSearchTerms">
                <Form.Control
                  value={this.state.searchTerm}
                  onChange={this.handleSearch}
                  type="search"
                  placeholder="Search Recipi titles ..." />
              </Form.Group>
            </Form>
            <br></br>

            <div className="text-center">
              <Button className="btn" style={{ margin: "3px" }} variant="info" onClick={this.showInput}>Post a Recipi</Button>
              <Button className="btn" style={{ margin: "3px" }} variant="info" onClick={this.toggleMyRecipes}>{this.state.toggleMyRecipesText}</Button>
              <Button className="btn" style={{ margin: "3px" }} variant="info" onClick={this.toggleMap}>Toggle Map</Button>
              <Button className="btn" style={{ margin: "3px" }} variant="info" onClick={() => { this.loadRandomRecipe(this) }}>Choose For Me</Button>
            </div>
            <br></br>

            {displayedRecipes}
            <br></br>

            <div className="text-center">
              <Button className="btn" variant="secondary" onClick={() => { this.logout(this.state.token) }}>Logout</Button>
            </div>
          </Container>
        </div>)
        //if token is invalid, present guest page
    
    }
    //if no token exists to authenticate or user is not logged in, present guest page
    else if (!this.state.token || !this.state.isLoggedIn) {
      let displayedRecipes = ""
        //if there is currently a non-empty search term string, only display filtered recipes
        if (this.state.searchTerm !== "") {
          displayedRecipes = <Row>{this.state.filtRecipes}</Row>
        } else {
          displayedRecipes = <Row>{this.state.recipes}</Row>
        }

        return (
          <div>
            <Container>
              <h3 className="text-center"> Welcome {this.state.userData}, check out these Recipis!</h3>
              <Form onSubmit={(e) => { e.preventDefault() }}>
                <Form.Group controlId="formSearchTerms">
                  <Form.Control
                    value={this.state.searchTerm}
                    onChange={this.handleSearch}
                    type="search"
                    placeholder="Search Recipi titles ..." />
                </Form.Group>
              </Form>
              <br></br>

              <div className="text-center">
                <Button className="btn" style={{ margin: "3px" }} variant="info" onClick={this.goLogin}>Login/Register</Button>
                <Button className="btn" style={{ margin: "3px" }} variant="info" onClick={this.toggleMap}>Toggle Map</Button>
                <Button className="btn" style={{ margin: "3px" }} variant="info" onClick={() => { this.loadRandomRecipe(this) }}>Choose For Me</Button>
              </div>
              <br></br>

              {displayedRecipes}
              <br></br>
            </Container>
          </div>)
    }
    
  }
}

export default Home