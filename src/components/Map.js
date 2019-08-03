import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';

const mapStyles = {
    width: '62%',
    height: '62%'
};

export class MapContainer extends Component {
    constructor(props) {
        super(props)
        this.state={
            token: "",
            isLoading: true,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            userLocation: { lat: 30.26, lng: -97.74}
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
              <Marker
                position={{ lat: 30.254659, lng: -97.762101}}
                onClick={this.onMarkerClick}
                name={"Odd Duck"}
              />
              <Marker
                position={{ lat: 30.249659, lng: -97.749984}}
                onClick={this.onMarkerClick}
                name={"Hopdoddy"}
              />
              <Marker
                position={{ lat: 30.245221, lng: -97.779389}}
                onClick={this.onMarkerClick}
                name={"Matt's El Rancho"}
              />
              <Marker
                position={{ lat: 30.249199, lng: -97.749589}}
                onClick={this.onMarkerClick}
                name={"Home Slice"}
              />
              <Marker
                position={{ lat: 30.266742, lng: -97.744948}}
                onClick={this.onMarkerClick}
                name={"Truluck's"}
              />
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