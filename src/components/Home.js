import React from 'react';
import { Redirect, Route } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from "react-bootstrap";
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
      recipeDescription: ""
    }
    this.goBack = this.goBack.bind(this);
    this.showInput = this.showInput.bind(this);
    this.loadRecipes = this.loadRecipes.bind(this);
    this.plusRating = this.plusRating.bind(this);
  }
  componentDidMount() {
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
  capitalize_Words(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
  showInput() {
    this.setState({ inputRecipe: <Container><div className="row align-items-center justify-content-center"><PostRecipe user={this.state.userData} goBack={this.goBack} /></div></Container> })

  }
  goBack() {
    this.loadRecipes()
    this.setState({ inputRecipe: "" })
  }
  jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  plusRating(title, index) {
    let self = this
    fetch('/api/user/didvote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: this.state.userData,
        recipeTitle: title
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
              title: title
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
                  title: title
                }),
              }).then((res) => {
                return res.json()
              }).then((result) => {
                newRecipe = result[0]
                let newRecipeArray = [...self.state.recipes]
                newRecipeArray[index] = <Col key={index} xs="6" sm="4"><div style={{ textAlign: "left" }}>    <p><span style={{ fontWeight: "bold" }}>{self.capitalize_Words(newRecipe.title)}</span> <br></br><span style={{ fontStyle: "italic" }}>By {newRecipe.user} </span><br></br> {self.jsUcfirst(newRecipe.description)}</p><img onClick={()=>{self.showDesc(newRecipe)}} src={newRecipe.image} id="imgClick" className="img-fluid"></img><p>Already voted!</p> <p>Rating: {newRecipe.rating} </p><br></br></div></Col>
                self.setState({ recipes: newRecipeArray })
              })
            }
          }
          )
        } else {
          alert("already voted!")
        }
      });
  }
  minusRating(title, index) {
    let self = this
    fetch('/api/user/didvote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: this.state.userData,
        recipeTitle: title
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
              title: title
            })
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
                  title: title
                }),
              }).then((res) => {
                return res.json()
              }).then((result) => {
                newRecipe = result[0]
                let newRecipeArray = [...self.state.recipes]
                newRecipeArray[index] = <Col key={index} xs="6" sm="4"><div style={{ textAlign: "left" }}>    <p><span style={{ fontWeight: "bold" }}>{self.capitalize_Words(newRecipe.title)}</span> <br></br><span style={{ fontStyle: "italic" }}>By {newRecipe.user} </span><br></br> {self.jsUcfirst(newRecipe.description)}</p><img onClick={()=>{self.showDesc(newRecipe)}} src={newRecipe.image} id="imgClick" className="img-fluid"></img><p>Already voted!</p> <p>Rating: {newRecipe.rating} </p><br></br></div></Col>
                self.setState({ recipes: newRecipeArray })
              })
            }
          }
          )
        } else {
          alert("already voted!")
        }
      });

  }
  loadRecipes() {
    let self = this
    this.setState({ isLoading: true })
    return fetch('/api/recipes', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(json => {
        let allRecipes = []
        json.sort(function (a, b) {
          return b.rating - a.rating
        })
        for (let i = 0; i < json.length; i++) {
          console.log("user is "+json[i].user)
          console.log("recipe title is "+json[i].title)
          let recipeItem = fetch('/api/user/didvote', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user: self.state.userData,
              recipeTitle: json[i].title,
              dontChange: true
            }),
          }).then(res => res.json())
            .then(goodJson => {
              console.log("goodJson is: ")
              console.dir(goodJson)
            if (goodJson.success) {
              return <Col key={i} xs="6" sm="4"><div style={{ textAlign: "left"}}>    <p><span style={{ fontWeight: "bold" }}>{this.capitalize_Words(json[i].title)}</span> <br></br><span style={{ fontStyle: "italic" }}>By {json[i].user} </span><br></br> {this.jsUcfirst(json[i].description)}</p><img onClick={()=>{this.showDesc(json[i])}} src={json[i].image} id="imgClick" className="img-fluid"></img><Button style={{border: "1px solid black"}} variant="light" onClick={() => { this.plusRating(json[i].title, i) }}> + </Button><Button style={{border: "1px solid black"}} variant="light" onClick={() => { this.minusRating(json[i].title, i) }}> - </Button> <p>Rating: {json[i].rating} </p><br></br></div></Col>
            } else {
              return <Col key={i} xs="6" sm="4"><div style={{ textAlign: "left"}}>    <p><span style={{ fontWeight: "bold" }}>{this.capitalize_Words(json[i].title)}</span> <br></br><span style={{ fontStyle: "italic" }}>By {json[i].user} </span><br></br> {this.jsUcfirst(json[i].description)}</p><img onClick={()=>{this.showDesc(json[i])}} src={json[i].image} id="imgClick" className="img-fluid"></img><p>Already voted!</p> <p>Rating: {json[i].rating} </p><br></br></div></Col>
            }
          })
          allRecipes.push(recipeItem)
        }
        Promise.all(allRecipes).then((allRecipes)=> {
          this.setState({ recipes: allRecipes, isLoading: false })
        })
      })


  }
  showDesc(recipe) {
    let arrayOfElements = []
    for (let i = 0; i < recipe.ingredients.length; i++) {
      arrayOfElements.push(<div>{`\u2022`} {recipe.ingredients[i]}<br></br></div>)
    }
    let newComponent = <Container><h1>{this.capitalize_Words(recipe.title)}</h1> <p>by {recipe.user}</p> <img className="img-fluid" src={recipe.image}></img> {arrayOfElements} <br></br> <p>{recipe.longDescription}</p><p>{recipe.instructions}</p><br></br><Button onClick={()=>{this.setState({recipeDescription: ""})}}>Go Back</Button></Container>
    this.setState({recipeDescription: newComponent})
  }
  logout(token) {
    this.setState({ isLoading: true })
    fetch('/api/account/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }
    }).then((res) => {
      res.json()
      this.props.saveToken("")
      this.setState({ logout: true, isLoggedIn: false, isLoading: false })
    })

  }
  render() {
    if (this.state.isLoading) {
      return <Container> <div className="text-center"><h2 className="text-center">Loading ... </h2> </div></Container>
    }
    if (this.state.recipeDescription) {
      return this.state.recipeDescription
    }
    if (this.state.logout) {
      return <Redirect to='/' />
    }
    if (this.state.inputRecipe) {
      return this.state.inputRecipe
    }
    if (this.state.token) {
      if (this.state.isLoggedIn) {
        return (<Container>

          <h3 className="text-center"> Welcome {this.state.userData}, check out these Recipis!</h3>
          <br></br>

          <div className="text-center">
            <Button className="btn" variant="secondary" onClick={this.showInput}>Post a Recipi</Button>
          </div>
          <br></br>

          <Row>
            {this.state.recipes}
            <br></br>
          </Row>
          <div className="text-center">
            <Button className="btn" variant="secondary" onClick={() => { this.logout(this.state.token) }}>Logout</Button>
          </div>
        </Container>)
      } else {
        return (<Container><div className="text-center"><p>Loading ... </p></div></Container>)
      }
    } else if (!this.state.token) {
      return (<div><Redirect to="/" /></div>)
    }
  }
}

export default Home