import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '90%'
};

export class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: this.props.token,
      isLoading: true,
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      userLocation: { lat: 30.26, lng: -97.74 },
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
          console.dir(markers[i])

          let newMarker = <Marker
            position={markers[i].location}
            onClick={this.onMarkerClick}
            title={this.capitalize_Words(markers[i].restaurant)}
            name={this.capitalize_Words(markers[i].recipe)}
            key={i}
          />
          recipiMarkers.push(newMarker)
        }
        this.setState({ recipiMarkers: recipiMarkers })

      })
  }
  capitalize_Words(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }
  onMarkerClick = (props, marker, e) => {
    console.dir(marker)
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }
  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };
  //because event handlers in dynamic infowindow content cannot work properly, render React content to element within InfoWindow by id
  onInfoWindowOpen(props, e) {
    const content = (<div><h3><span onClick={() => { this.props.loadRecipeFromMap(this.state.selectedPlace.name, this.props.oldSelf) }} style={{ cursor: "pointer" }}>{this.state.selectedPlace.name} from {this.state.selectedPlace.title}</span></h3>
      <p>Click the dish to be taken to its Recipi!</p></div>)
    ReactDOM.render(React.Children.only(content), document.getElementById("currentInfo"))
  }
  render() {
    if (this.state.isLoading) {
      return <div>Loading ... </div>
    }
    return (
      <Map
        google={this.props.google}
        zoom={12}
        style={mapStyles}
        initialCenter={this.state.userLocation}
      >
        {this.state.recipiMarkers}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
          onOpen={e => {
            this.onInfoWindowOpen(this.props, e);
          }}
        >
          <div id="currentInfo">
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyClOhMinsJlKmviBdX43_mVHtn4Uk7qb6k'
})(MapContainer);