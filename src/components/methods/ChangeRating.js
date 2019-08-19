import React from 'react';
import { Col } from 'react-bootstrap';

let changeRating = (title, index, plus, self) => {
    let change = "minus"
    if (plus) {
        change = "plus"
    }
    //confirm user did note already vote
    fetch('/api/user/didvote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: self.state.userData,
            recipeTitle: title,
            token: self.state.token
        }),
    }).then(res => res.json())
        .then(json => {
            if (json.success) {
                //if vote is valid, post change
                fetch(`/api/recipes/${change}rating`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: title,
                        token: self.state.token
                    }),
                }).then((res) => { return res.json() }).then((json) => {
                    if (json.success) {
                        //once change is posted, replace recipe item in state array with updated recipe
                        let newRecipe = {}
                        fetch('/api/recipes/find', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                title: title,
                                token: self.state.token
                            }),
                        }).then((res) => {
                            return res.json()
                        }).then((result) => {
                            newRecipe = result[0]
                            let newRecipeArray = [...self.state.recipes]
                            let ratingButtons = <div><p style={{ paddingTop: "8px" }}>Already voted! - <span style={{ fontWeight: "bold" }}>Rating: {newRecipe.rating} </span></p></div>
                            newRecipeArray[index] = <Col key={index} xs="6" sm="4"><div style={{ textAlign: "left" }}>    <img onClick={() => { self.showDesc(newRecipe, ratingButtons, false, self) }} src={newRecipe.image} id="imgClick" className="img-fluid shadow p-1 mb-3 rounded recImg" ></img><p><span style={{ fontWeight: "bold" }}>{self.capitalize_Words(newRecipe.title)}</span> <br></br><span style={{ fontStyle: "italic" }}>By {newRecipe.user} </span><br></br> {self.jsUcfirst(newRecipe.description)}</p>{ratingButtons}<br></br></div></Col>
                            self.setState({ recipes: newRecipeArray })

                            //if page is currently displayed a recipe description, refresh the component to display new rating properly
                            if (self.state.recipeDescription) {
                                self.setState({ recipeDescription: "" })
                                //send the detailed description page a special goBack function, to fully reload page recipes (avoids duplicate recipe error)
                                let refreshPage = () => {
                                    self.loadRecipes(self)
                                    self.setState({ recipeDescription: "" })
                                }
                                self.showDesc(newRecipe, ratingButtons, refreshPage, self)
                            }
                            //if there is currently a search term filtering results, refresh the filtering to display new rating properly
                            if (self.state.searchTerm) {
                                self.handleSearch()
                            }
                            //if user is currently viewing their own recipes, refresh the list to update rankings properly
                            if (self.state.showMyRecipes) {
                                self.loadRecipes(self)
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

export default changeRating