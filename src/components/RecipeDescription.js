import React from 'react';
import { Button, Container, Form } from "react-bootstrap";

class RecipeDescription extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ratingButtons: this.props.ratingButtons,
            title: this.props.title,
            user: this.props.user,
            commentText: "",
            token: this.props.token,
            comments: [],
            commentSubmit: false
        }
    }
    componentDidMount = () => {
        this.loadComments()
        if (this.props.isLoggedIn) {
            this.setState({commentSubmit: true})
        }

    }
    handleChange = (e) => {
        this.setState({ commentText: e.target.value })
    }
    loadComments = () => {
        return fetch('/api/comments', {
            method: 'GET',
            headers: {
                'recipe': this.state.title
            },
        })
            .then(res => res.json())
            .then(json => {
                let newComments = json.map((comment, index) => {
                    return <div key={index} style={{ border: "1px solid #6EC2F0", margin: "2px", padding: "10px", borderRadius: "10px" }}><p><span style={{ fontWeight: "bold" }}>{comment.user}</span> - <span opacity={0.5}>{comment.date}</span></p><p>{comment.comment}</p></div>
                })
                this.setState({ comments: newComments.reverse() })
            })

    }
    handleCommentSubmit = (e) => {
        e.preventDefault()
        this.setState({ commentText: "" })
        if (!this.state.commentText) {
            alert("Comment cannot be blank!")
            return "error"
        }
        const {
            title,
            commentText,
            token
        } = this.state;
        if (!token) {
            alert("log in to post comments!")
            return
        }
        let user = this.props.currentUser
        fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipe: title,
                user: user,
                comment: commentText,
                token: token
            }),
        }).then(res => res.json())
            .then(json => {
            }).then(() => { this.loadComments() });

    }
    render() {
        let comForm = <h3>Please log in to submit comments!</h3>
        if (this.state.commentSubmit) {
            comForm = 
            <Form
            onSubmit={this.handleCommentSubmit}>
                <h3>Leave a comment below!</h3>
                <Form.Group controlId="commentInput">
                    <Form.Control
                        as="textarea"
                        rows="3"
                        placeholder="Enter comment ..."
                        value={this.state.commentText}
                        onChange={this.handleChange} />
                </Form.Group>
                <Button
                    block
                    type="submit"
                    variant="info"
                >
                    Submit!
                    </Button>
            </Form>
        }
        return <Container>
            <br></br>
            <Button variant="info" onClick={this.props.goBack}>Go Back</Button>
            <h1>{this.state.title}</h1> <p>by {this.state.user}</p>
            <img className="img-fluid shadow-lg p-2 mb-3 rounded" style={{ "maxHeight": 550 }} src={this.props.imgSrc}></img>
            {this.state.ratingButtons} <p style={{ margin: "2px", padding: "5px" }} >{this.props.longDesc}</p>
            <div style={{ border: "2px solid #6EC2F0", margin: "2px", padding: "5px", borderRadius: "5px", backgroundColor: "#f5fcff" }}><br></br>{this.props.elements}<br></br><p>{this.props.instructions}</p></div>
            <br></br>
            {comForm}
            <br></br>
            {this.state.comments}


        </Container>
    }
}



export default RecipeDescription