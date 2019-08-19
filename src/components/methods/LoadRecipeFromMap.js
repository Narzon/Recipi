import React from 'react';
import { Button } from 'react-bootstrap';

// load a recipe from a marker on the map component
let loadRecipeFromMap = (recipe, self) => {
    recipe = recipe.toLowerCase()
    self.setState({ showMap: false, isLoading: true })
    fetch('/api/recipes/find', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: self.state.token,
            title: recipe
        })
    })
        .then(res => res.json())
        .then(json => {
            fetch('/api/user/didvote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: self.state.userData,
                    recipeTitle: recipe,
                    dontChange: true,
                    token: self.state.token
                }),
            }).then(res => res.json())
                .then(goodJson => {
                    let ratingButtons = ""
                    if (!json[0]) {
                        //if the server cannot find a recipe with matching name, bring user back to the map
                        alert("Recipi not found!")
                        self.setState({ isLoading: false })
                        self.setState({ showMap: true })
                        return
                    }
                    if (goodJson.success) {
                        ratingButtons = <div ><Button style={{ border: "1px solid black", width: "45px", height: "45px", fontWeight: "bold", fontSize: "20px" }} variant="info" onClick={() => { self.changeRating(json[0].title, 0, true, self) }}>	+ </Button><Button style={{ border: "1px solid black", width: "45px", height: "45px", fontWeight: "bold", fontSize: "20px" }} variant="info" onClick={() => { self.changeRating(json[0].title, 0, false, self) }}> - </Button> <p style={{ fontWeight: "bold" }}>Rating: {json[0].rating} </p></div>
                    } else {
                        ratingButtons = <div><p style={{ paddingTop: "8px" }}>Already voted!</p> <p style={{ fontWeight: "bold" }}>Rating: {json[0].rating} </p></div>
                    }
                    self.showDesc(json[0], ratingButtons, false, self)
                    self.setState({ isLoading: false })
                })
        })
}
export default loadRecipeFromMap