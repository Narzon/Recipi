import React from 'react';
import { Button } from 'react-bootstrap';

let loadRandomRecipe = (self) => {
    self.setState({ isLoading: true })
    let i = Math.floor(Math.random() * self.state.recipes.length)
    fetch('/api/recipes', {
        method: 'GET',
        headers: {
            'token': self.state.token
        },
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
                    recipeTitle: json[i].title,
                    dontChange: true,
                    token: self.state.token
                }),
            }).then(res => res.json())
                .then(goodJson => {
                    let ratingButtons = ""
                    if (goodJson.success) {
                        ratingButtons = <div><Button style={{ border: "1px solid black", width: "45px", height: "45px", fontWeight: "bold", fontSize: "20px" }} variant="info" onClick={() => { self.changeRating(json[i].title, i, true, self) }}>	+ </Button><Button style={{ border: "1px solid black", width: "45px", height: "45px", fontWeight: "bold", fontSize: "20px" }} variant="info" onClick={() => { self.changeRating(json[i].title, i, false, self) }}> - </Button> <p style={{ fontWeight: "bold" }}>Rating: {json[i].rating} </p></div>
                    } else {
                        ratingButtons = <div><p style={{ paddingTop: "8px" }}>Already voted!</p> <p style={{ fontWeight: "bold" }}>Rating: {json[i].rating} </p></div>
                    }
                    self.showDesc(json[i], ratingButtons, false, self)
                    self.setState({ isLoading: false })
                })
        })

}

export default loadRandomRecipe