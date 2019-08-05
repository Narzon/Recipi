import React from 'react';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";

class PostRecipe extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            shortDesc: "",
            longDesc: "",
            ingredients: [],
            instructions: "",
            imageURL: "",
            restaurant: "",
            city: ""
        }
    }
    componentDidMount() {
        //this.props.user

    }
    //post input data as new recipe to server
    handleSubmit = event => {
        this.setState({isLoading: true})
        event.preventDefault();
        const {
            title,
            shortDesc,
            longDesc,
            ingredients,
            instructions,
            imageURL,
            restaurant,
            city
        } = this.state;
        let ingredientsArray = ingredients.replace(/\s*,\s*/g, ",").split(',')
        ingredientsArray = ingredientsArray.map((item)=>{
            let newItem= ""+item[0].toUpperCase()+item.slice(1)
            return newItem
        })
        fetch('/api/recipes', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.props.token,
                user: this.props.user,
                title: title,
                description: shortDesc,
                longDescription: longDesc,
                ingredients: ingredientsArray,
                instructions: instructions,
                image: imageURL
            }),
        }).then(res => res.json())
            .then(json => {
            //upon successful posting, go back
            if (json.success) {
                alert("Recipi saved!")
                this.props.goBack(true)
            } else {
                //else, alert user of error and remain on page
                alert("Failed! Server error.")
            }
        });

        //attempt to post marker for google map
        fetch('/api/markers', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.props.token,
                recipe: title,
                restaurant: restaurant,
                city: city
            }),
        }).then(res => res.json())
            .then(json => {
            //upon successful posting, go back
            if (json.success) {
                console.log("marker saved successfully")
            } 
        });



    }

    handleChange = event => {
        this.setState({
        [event.target.id]: event.target.value
        });
    }
    render() {
        //render an input form for a new recipe
        return (<div className="col">
        <h2 className="text-center">Here's your form, {this.props.user}</h2>
            <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="title" bsSize="large">
                    <FormLabel>Recipi Title  </FormLabel>
                    <FormControl
                    autoFocus
                    type="title"
                    value={this.state.title}
                    onChange={this.handleChange}
                    placeholder="Enter your Recipi title ... "
                    />
                </FormGroup>
                <FormGroup controlId="shortDesc" bsSize="large">
                    <FormLabel>A short summay  </FormLabel>
                    <FormControl
                    value={this.state.shortDesc}
                    onChange={this.handleChange}
                    type="shortDesc"
                    as="textarea" 
                    placeholder="Enter a short subtitle for your Recipi"
                    rows="2"
                    />
                </FormGroup>
                <FormGroup controlId="longDesc" bsSize="large">
                    <FormLabel>A longer description  </FormLabel>
                    <FormControl
                    value={this.state.longDesc}
                    onChange={this.handleChange}
                    type="longDesc"
                    as="textarea" 
                    placeholder="Enter your full description or Recipi story here ..."
                    rows="4"
                    />
                </FormGroup>
                <FormGroup controlId="instructions" bsSize="large">
                    <FormLabel>Recipi instructions  </FormLabel>
                    <FormControl
                    value={this.state.instructions}
                    onChange={this.handleChange}
                    type="instructions"
                    as="textarea"
                    placeholder="Enter your instructions ... " 
                    rows="4"
                    />
                </FormGroup>
                <FormGroup controlId="ingredients" bsSize="large">
                    <FormLabel>Ingredients  </FormLabel>
                    <FormControl
                    value={this.state.ingredients}
                    onChange={this.handleChange}
                    type="ingredients"
                    as="textarea"
                    placeholder="Separate by commas" 
                    rows="4"
                    />
                </FormGroup>
                <FormGroup controlId="imageURL" bsSize="large">
                    <FormLabel>Image URL  </FormLabel>
                    <FormControl
                    value={this.state.imageURL}
                    onChange={this.handleChange}
                    type="imageURL"
                    />
                </FormGroup>
                <FormGroup controlId="restaurant" bsSize="large">
                    <FormLabel>(Optional) Restaurant  </FormLabel>
                    <FormControl
                    value={this.state.restaurant}
                    onChange={this.handleChange}
                    type="restaurant"
                    />
                </FormGroup>
                <FormGroup controlId="city" bsSize="large">
                    <FormLabel>(Optional) City  </FormLabel>
                    <FormControl
                    value={this.state.city}
                    onChange={this.handleChange}
                    type="city"
                    />
                </FormGroup>
                <Button
                    block
                    bsSize="large"
                    type="submit"
                    variant="info"
                >
                    Submit your Recipi!
                </Button>
                <br></br>
                <Button variant="info" onClick={()=>{this.props.goBack(false)}}>Go back</Button>
            </form>
        </div>)
    }
    }

    export default PostRecipe