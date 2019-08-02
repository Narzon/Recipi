import React from 'react';
import { Button, Container } from "react-bootstrap";

class RecipeDescription extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ratingButtons: this.props.ratingButtons
        }
    }
    render() {
        return <Container><h1>{this.props.title}</h1> <p>by {this.props.user}</p> <img className="img-fluid" src={this.props.imgSrc}></img> {this.state.ratingButtons} {this.props.elements} <br></br> <p>{this.props.longDesc}</p><p>{this.props.instructions}</p><br></br><Button onClick={this.props.goBack}>Go Back</Button></Container>
    }
}



export default RecipeDescription