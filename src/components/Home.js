import React from 'react';
import { Redirect, Route } from 'react-router-dom'
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Button } from "react-bootstrap";
import RecipeDescription from "./RecipeDescription"
import PostRecipe from './PostRecipe'



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
      toggleMyRecipesText: "Show My Recipis"
    }
    this.goBack = this.goBack.bind(this);
    this.showInput = this.showInput.bind(this);
    this.loadRecipes = this.loadRecipes.bind(this);
    this.plusRating = this.plusRating.bind(this);
    this.toggleMyRecipes = this.toggleMyRecipes.bind(this);
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
          this.loadRecipes()
        } else {
          this.setState({
            isLoggedIn: false,
            isLoading: false
          });
        }
      });

  }
  // handle a new search term being entered to filter which recipes are displayed
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
  //method renders an input form for new recipes
  showInput() {
    this.setState({ inputRecipe: <Container><div className="row align-items-center justify-content-center"><PostRecipe user={this.state.userData} token={this.state.token} goBack={this.goBack} /></div></Container> })
  }
  //props function in recipe input form, used to return to main page
  goBack(doRefresh) {
    if (doRefresh) {
      this.loadRecipes()
    }
    this.setState({ inputRecipe: "" })
  }
  //method capitalizes only the first letter in a string, used for descriptions etc.
  jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  //method increments a recipe's rating by +1 if user has not already voted
  plusRating(title, index) {
    let self = this
    fetch('/api/user/didvote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: this.state.userData,
        recipeTitle: title,
        token: this.state.token
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          fetch('/api/recipes/plusrating', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: title,
              token: this.state.token
            }),
          }).then((res) => { return res.json() }).then((json) => {
            if (json.success) {
              //this.loadRecipes()
              let newRecipe = {}
              fetch('/api/recipes/find', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  title: title,
                  token: this.state.token
                }),
              }).then((res) => {
                return res.json()
              }).then((result) => {
                newRecipe = result[0]
                let newRecipeArray = [...self.state.recipes]
                let ratingButtons = <div><p>Already voted!</p> <p>Rating: {newRecipe.rating} </p></div>
                newRecipeArray[index] = <Col key={index} xs="6" sm="4"><div style={{ textAlign: "left" }}>    <p><span style={{ fontWeight: "bold" }}>{self.capitalize_Words(newRecipe.title)}</span> <br></br><span style={{ fontStyle: "italic" }}>By {newRecipe.user} </span><br></br> {self.jsUcfirst(newRecipe.description)}</p><img onClick={() => { self.showDesc(newRecipe, ratingButtons) }} src={newRecipe.image} id="imgClick" style={{ height: "auto", maxHeight: "275px"}}className="img-fluid shadow p-1 mb-3 rounded" ></img>{ratingButtons}<br></br></div></Col>
                self.setState({ recipes: newRecipeArray })

                //if page is currently displayed a recipe description, refresh the component to display new rating properly
                if (self.state.recipeDescription) {
                  self.setState({ recipeDescription: "" })
                  self.showDesc(newRecipe, ratingButtons)
                }
                //if there is currently a search term filtering results, refresh the filtering to display new rating properly
                if (self.state.searchTerm) {
                  self.handleSearch()
                }
                //if user is currently viewing their own recipes, refresh the list to update rankings properly
                if (self.state.showMyRecipes) {
                  self.loadRecipes()
                }

              })
            }
          }
          )
        } else {
          alert("already voted!")
        }
      });
  }
  //method increments a recipe's rating by -1 if user has not already voted
  minusRating(title, index) {
    let self = this
    fetch('/api/user/didvote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: this.state.userData,
        recipeTitle: title,
        token: this.state.token
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          fetch('/api/recipes/minusrating', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: title,
              token: this.state.token
            })
          }).then((res) => { return res.json() }).then((json) => {
            if (json.success) {
              let newRecipe = {}
              fetch('/api/recipes/find', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  title: title,
                  token: this.state.token
                }),
              }).then((res) => {
                return res.json()
              }).then((result) => {
                newRecipe = result[0]
                let newRecipeArray = [...self.state.recipes]
                let ratingButtons = <div><p>Already voted!</p> <p>Rating: {newRecipe.rating} </p></div>
                newRecipeArray[index] = <Col key={index} xs="6" sm="4"><div style={{ textAlign: "left" }}>    <p><span style={{ fontWeight: "bold" }}>{self.capitalize_Words(newRecipe.title)}</span> <br></br><span style={{ fontStyle: "italic" }}>By {newRecipe.user} </span><br></br> {self.jsUcfirst(newRecipe.description)}</p><img onClick={() => { self.showDesc(newRecipe, ratingButtons) }} src={newRecipe.image} id="imgClick" style={{ height: "auto", maxHeight: "275px"}} className="img-fluid shadow p-1 mb-3 rounded" ></img>{ratingButtons}<br></br></div></Col>
                self.setState({ recipes: newRecipeArray })

                //if page is currently displayed a recipe description, refresh the component to display new rating properly
                if (self.state.recipeDescription) {
                  self.setState({ recipeDescription: "" })
                  self.showDesc(newRecipe, ratingButtons)
                }
                //if there is currently a search term filtering results, refresh the filtering to display new rating properly
                if (self.state.searchTerm) {
                  self.handleSearch()
                }
                //if user is currently viewing their own recipes, refresh the list to update rankings properly
                if (self.state.showMyRecipes) {
                  self.loadRecipes()
                }

              })
            }
          }
          )
        } else {
          alert("already voted!")
        }
      });

  }
  //method fetches all recipes from database, sorts by rating in descending order, and format them for display
  loadRecipes() {

    let self = this
    this.setState({ isLoading: true })
    return fetch('/api/recipes', {
      method: 'GET',
      headers: {
        'token': this.state.token
      },
    })
      .then(res => res.json())
      .then(json => {
        let allRecipes = []
        let myRecipes = []
        //sort by rating in descending order
        json.sort(function (a, b) {
          return b.rating - a.rating
        })
        //check if current user voted already on each recipe
        for (let i = 0; i < json.length; i++) {
          let recipeItem = fetch('/api/user/didvote', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user: self.state.userData,
              recipeTitle: json[i].title,
              dontChange: true,
              token: this.state.token
            }),
          }).then(res => res.json())
            .then(goodJson => {
              let ratingButtons = ""
              if (goodJson.success) {
                ratingButtons = <div><Button style={{ border: "1px solid black" }} variant="light" onClick={() => { this.plusRating(json[i].title, i) }}> + </Button><Button style={{ border: "1px solid black" }} variant="light" onClick={() => { this.minusRating(json[i].title, i) }}> - </Button> <p>Rating: {json[i].rating} </p></div>
              } else {
                ratingButtons = <div><p>Already voted!</p> <p>Rating: {json[i].rating} </p></div>
              }
              let recipeTitleByIndex = self.state.recipeTitleByIndex
              recipeTitleByIndex[i] = json[i].title
              self.setState({ recipeTitleByIndex: recipeTitleByIndex })

              // if current user is the author of a recipe, add it to their own array
              if (self.state.userData === json[i].user) {
                console.log("adding a recipe to the myRecipes array. recipe author is: " + json[i].user + " and current user is: " + self.state.userData)
                myRecipes.push(<Col key={i} xs="6" sm="4"><div style={{ textAlign: "left" }}>    <p><span style={{ fontWeight: "bold" }}>{this.capitalize_Words(json[i].title)}</span> <br></br><span style={{ fontStyle: "italic" }}>By {json[i].user} </span><br></br> {this.jsUcfirst(json[i].description)}</p><img onClick={() => { this.showDesc(json[i], ratingButtons) }} src={json[i].image} id="imgClick" style={{ height: "auto", maxHeight: "275px"}} className="img-fluid shadow p-1 mb-3 rounded" ></img>{ratingButtons}<br></br></div></Col>)
              }

              return <Col key={i} xs="6" sm="4"><div style={{textAlign: "left"}}>    <p><span style={{ fontWeight: "bold" }}>{this.capitalize_Words(json[i].title)}</span> <br></br><span style={{ fontStyle: "italic" }}>By {json[i].user} </span><br></br> {this.jsUcfirst(json[i].description)}</p><img onClick={() => { this.showDesc(json[i], ratingButtons) }} src={json[i].image} id="imgClick" style={{ height: "auto", maxHeight: "275px"}} className="img-fluid shadow p-1 mb-3 rounded" ></img>{ratingButtons}<br></br></div></Col>
            })
          allRecipes.push(recipeItem)
        }
        Promise.all(allRecipes).then((allRecipes) => {
          if (!myRecipes[0]) {
            myRecipes.push(<h3>Nothing to show!</h3>)
          }
          this.setState({ recipes: allRecipes, myRecipes: myRecipes, isLoading: false })
        })
      })


  }
  //method shows a detailed description of recipe upon clicking
  showDesc(recipe, ratingButtons) {
    let self = this
    let arrayOfElements = []
    for (let i = 0; i < recipe.ingredients.length; i++) {
      arrayOfElements.push(<div>{`\u2022`} {recipe.ingredients[i]}<br></br></div>)
    }
    let newComponent = <RecipeDescription ratingButtons={ratingButtons} title={this.capitalize_Words(recipe.title)} user={recipe.user} imgSrc={recipe.image} elements={arrayOfElements} longDesc={recipe.longDescription} instructions={recipe.instructions} goBack={() => { self.setState({ recipeDescription: "" }) }} />
    this.setState({ recipeDescription: newComponent })
  }
  toggleMyRecipes() {
    if (this.state.showMyRecipes) {
      this.setState({ showMyRecipes: false, toggleMyRecipesText: "Show My Recipis" })
    } else {
      this.setState({ showMyRecipes: true, toggleMyRecipesText: "Show All Recipis" })
    }
  }
  //logs user out of current session
  logout(token) {
    this.setState({ isLoading: true })
    //NOW STATELESS - simply clear token from client-side
    this.props.saveToken("")
    this.setState({ logout: true, isLoggedIn: false, isLoading: false })

  }
  render() {
    //if content is loading, display Loading ... screen
    if (this.state.isLoading) {
      return <Container> <div className="text-center"><h2 className="text-center">Loading ... </h2> </div></Container>
    }
    //if a description exists in state, display that component
    if (this.state.recipeDescription) {
      return this.state.recipeDescription
    }
    //after logging out of session, return to entry page
    if (this.state.logout) {
      return <Redirect to='/' />
    }
    //if input form exists in state, display that component
    if (this.state.inputRecipe) {
      return this.state.inputRecipe
    }
    //check for token
    if (this.state.token) {
      //if token is valid and user successfully authenticates, display main recipes page
      if (this.state.isLoggedIn) {
        let displayedRecipes = ""
        //if there is currently a non-empty search term string, only display filtered recipes
        if (this.state.searchTerm !== "") {
          displayedRecipes = this.state.filtRecipes
        } else {
          displayedRecipes = this.state.recipes
        }
        if (this.state.showMyRecipes) {
          displayedRecipes = this.state.myRecipes
        }
        return (
        <div>
        <Container>
          <h3 className="text-center"> Welcome {this.state.userData}, check out these Recipis!</h3>
          <Form>
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
            <Button className="btn" variant="info" onClick={this.showInput}>Post a Recipi</Button>    <span> </span>
            <Button className="btn" variant="info" onClick={this.toggleMyRecipes}>{this.state.toggleMyRecipesText}</Button>
          </div>
          <br></br>

          <Row>
            {displayedRecipes}
            <br></br>
          </Row>
          <div className="text-center">
            <Button className="btn" variant="secondary" onClick={() => { this.logout(this.state.token) }}>Logout</Button>
          </div>
        </Container>
        </div>)
      } else {
        return (<Container><div className="text-center"><p>Loading ... </p></div></Container>)
      }
    }
    //if no token exists to authenticate, return to entrypage 
    else if (!this.state.token) {
      return (<div><Redirect to="/" /></div>)
    }
  }
}

export default Home