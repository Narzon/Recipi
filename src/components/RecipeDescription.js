import React from 'react';
import { Button, Container } from "react-bootstrap";

let RecipeDescription = (props) => {
    return <Container><h1>{props.title}</h1> <p>by {props.user}</p> <img className="img-fluid" src={props.imgSrc}></img> {props.elements} <br></br> <p>{props.longDesc}</p><p>{props.instructions}</p><br></br><Button onClick={props.goBack}>Go Back</Button></Container>
}



export default RecipeDescription