import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';

const mapStyles = {
    width: '100%',
    height: '90%'
};

export class MapContainer extends Component {
    constructor(props) {
        super(props)
        this.state={
            token: this.props.token,
            isLoading: true,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            userLocation: { lat: 30.26, lng: -97.74},
            recipiMarkers: [],
            displayMarkers: []
        }
    }
    componentDidMount() {
      navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
      
              this.setState({
                userLocation: { lat: latitude, lng: longitude },
                isLoading: false
              });

            },
            () => {
                //permission denied
              this.setState({ isLoading: false });
            }
          );

      fetch('/api/markers', {
        method: 'GET',
        headers: {
          'token': this.state.token
        },
      })
        .then(res => res.json())
        .then(markers => {
            let recipiMarkers = this.state.recipiMarkers
            for (let i = 0; i < markers.length; i++) {
              //let newMarker = {
               // restaurant: markers[i].restaurant,
               // recipe: markers[i].recipe,
               // location: markers[i].location
              //}
              let newMarker = <Marker
              position={markers[i].location}
              onClick={this.onMarkerClick}
              name={markers[i].restaurant+" - "+markers[i].recipe}
              />
              recipiMarkers.push(newMarker)
            }
            this.setState({recipiMarkers: recipiMarkers})
            console.log("here is your markers state array: ")
            console.dir(this.state.recipiMarkers)
        })
    }
    onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
    onClose = props => {
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          });
        }
      };
    render() {
        if (this.state.isLoading) {
            return <div>Loading ... </div>
        }
        return (
            <Map
              google={this.props.google}
              zoom={14}
              style={mapStyles}
              initialCenter={this.state.userLocation}
            >
              {this.state.recipiMarkers}
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}
              >
                <div>
                  <h4>{this.state.selectedPlace.name}</h4>
                </div>
              </InfoWindow>
            </Map>
          );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyClOhMinsJlKmviBdX43_mVHtn4Uk7qb6k'
})(MapContainer);