import React from 'react';
import RecipeDescription from "../RecipeDescription"

//render a description page for selected recipe
let showDesc = (recipe, ratingButtons, altGoBack, self) => {
    let arrayOfElements = []
    for (let i = 0; i < recipe.ingredients.length; i++) {
        arrayOfElements.push(<div>{`\u2022`} {recipe.ingredients[i]}<br></br></div>)
    }
    let goBack = () => { self.setState({ recipeDescription: "" }) }
    // if given, pass on a different goBack method for the description page
    if (altGoBack) {
        goBack = altGoBack
    }
    let newComponent = <RecipeDescription token={self.state.token} currentUser={self.state.userData} ratingButtons={ratingButtons} title={self.capitalize_Words(recipe.title)} user={recipe.user} imgSrc={recipe.image} elements={arrayOfElements} longDesc={recipe.longDescription} instructions={recipe.instructions} goBack={goBack} />
    self.setState({ recipeDescription: newComponent })
    window.scrollTo(0, 0)
}

export default showDesc