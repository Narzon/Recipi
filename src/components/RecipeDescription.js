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
        return <Container><br></br><Button variant="info" onClick={this.props.goBack}>Go Back</Button><h1>{this.props.title}</h1> <p>by {this.props.user}</p> <img className="img-fluid shadow-lg p-2 mb-3 rounded" style={{"max-height": 550}} src={this.props.imgSrc}></img> {this.state.ratingButtons} {this.props.elements} <br></br> <p>{this.props.longDesc}</p><p>{this.props.instructions}</p><br></br></Container>
    }
}



export default RecipeDescription