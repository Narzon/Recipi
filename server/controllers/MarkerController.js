const Marker = require("../models/MarkerModel");
require("dotenv").config();
var jwt = require('jsonwebtoken');
const fetch = require("node-fetch");

function showAll(req, res, next) {
    Marker.find({ 
        }, (err, result) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        }
        res.send(result)
    })
}

function create(req, res, next) {
    let { token, recipe, restaurant, city } = req.body;
    try {
      let userData = jwt.verify(token, process.env.secretKey)
    } catch (err) {
      return res.send({
        success: false,
        message: "Bad, verification failed"
      })
    }
 
  
    const newMarker = new Marker();
    newMarker.recipe = recipe
    newMarker.restaurant = restaurant
    newMarker.city = city
    let location = {}

    fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${restaurant+" "+city}&inputtype=textquery&fields=geometry&key=AIzaSyClOhMinsJlKmviBdX43_mVHtn4Uk7qb6k`, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(json => {
            if (json.candidates[0]){
                let geoObject = json.candidates[0].geometry.location
                location = geoObject
                newMarker.location = location
                newMarker.save((err, comment) => {
                    if (err) {
                        return res.send({
                        success: false,
                        message: 'Error: Server error'
                        });
                    }
                    return res.send({
                        success: true,
                        message: 'Marker posted!'
                    });
                    });
            } else {
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }
        })
}
exports.showAll = showAll;
exports.create = create;
