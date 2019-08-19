import React from 'react';
import { Col, Button } from 'react-bootstrap';


//load all recipes from server, sorting by rating, and adding current user's recipes to myRecipes array
let loadRecipes = (self) => {
    self.setState({ isLoading: true })
    return fetch('/api/recipes', {
        method: 'GET',
        headers: {
            'token': self.state.token
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
                        token: self.state.token
                    }),
                }).then(res => res.json())
                    .then(goodJson => {
                        let ratingButtons = ""
                        //depending on whether or not current user has voted on a recipi, display either vote buttons or an "Already voted" message next to the current rating
                        if (goodJson.success) {
                            ratingButtons = <div><Button style={{ border: "1px solid black", width: "45px", height: "45px", fontWeight: "bold", fontSize: "20px" }} variant="info" onClick={() => { self.changeRating(json[i].title, i, true, self) }}>	+ </Button><Button style={{ border: "1px solid black", width: "45px", height: "45px", fontWeight: "bold", fontSize: "20px" }} variant="info" onClick={() => { self.changeRating(json[i].title, i, false, self) }}> - </Button> -<span style={{ fontWeight: "bold" }}> Rating: {json[i].rating} </span></div>
                        } else {
                            ratingButtons = <div><p style={{ paddingTop: "8px" }}>Already voted! - <span style={{ fontWeight: "bold" }}>Rating: {json[i].rating} </span></p></div>
                        }
                        let recipeTitleByIndex = self.state.recipeTitleByIndex
                        recipeTitleByIndex[i] = json[i].title
                        self.setState({ recipeTitleByIndex: recipeTitleByIndex })

                        // if current user is the author of a recipe, add it to their own array
                        if (self.state.userData === json[i].user) {
                            myRecipes.push(<Col key={i} xs="6" sm="4"><div style={{ textAlign: "left" }}>    <img onClick={() => { self.showDesc(json[i], ratingButtons, false, self) }} src={json[i].image} id="imgClick" className="img-fluid shadow p-1 mb-3 rounded recImg" ></img><p><span style={{ fontWeight: "bold" }}>{self.capitalize_Words(json[i].title)}</span> <br></br><span style={{ fontStyle: "italic" }}>By {json[i].user} </span><br></br> {self.jsUcfirst(json[i].description)}</p>{ratingButtons}<br></br></div></Col>)
                        }

                        return <Col key={i} xs="6" sm="4" ><div style={{ textAlign: "left", maxWidth: "100%" }}>    <img onClick={() => { self.showDesc(json[i], ratingButtons, false, self) }} src={json[i].image} id="imgClick" className="img-fluid shadow p-1 mb-3 rounded recImg" ></img><p><span style={{ fontWeight: "bold" }}>{self.capitalize_Words(json[i].title)}</span> <br></br><span style={{ fontStyle: "italic" }}>By {json[i].user} </span><br></br> {self.jsUcfirst(json[i].description)}</p>{ratingButtons}<br></br></div></Col>
                    })
                allRecipes.push(recipeItem)
            }
            Promise.all(allRecipes).then((allRecipes) => {
                if (!myRecipes[0]) {
                    myRecipes.push(<h3>Nothing to show!</h3>)
                }
                self.setState({ recipes: allRecipes, myRecipes: myRecipes, isLoading: false })
            })
        })
}

export default loadRecipes