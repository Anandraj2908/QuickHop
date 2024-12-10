const express = require("express");
const { WebSocketServer } = require("ws");
const geolib = require("geolib");

const app = express();
const PORT = 3000;

let drivers = {};

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    try{
        const data = JSON.parse(message);
        console.log("Received message: ", data);

        if(data.type === "locationUpdate" && data.role === "driver"){
            drivers[data.driver] = {
                latitude: data.data.latitude,
                longitude: data.data.longitude,
                lastUpdated: new Date().getTime(),
                gender:data.gender,
                userGenderPreference: data.userGenderPreference
            };
            console.log("Updated driver location: ", drivers[data.driver]);
        }

        if (data.type === "requestRide" && data.role === "user") {
            console.log("Requesting ride...");
            const nearbyDrivers = findNearbyDrivers(data.latitude, data.longitude, data.gender, data.riderGenderPreference);
            console.log("Nearby drivers: ", nearbyDrivers);
            ws.send(
              JSON.stringify({ type: "nearbyDrivers", drivers: nearbyDrivers })
            );
        } 

        if(data.type === "getDriverLocation" && data.role === "user"){
            ws.send(JSON.stringify({ type: "driverLiveLocationWithId", location: drivers[data.driverId] }));
            console.log("Sending driver location to user: ", drivers[data.driverId]);
        }

        if(data.type === "driverOffStatus" && data.role === "driver"){
            delete drivers[data.driver];
            console.log("Driver off status: ", drivers);
        }
    } catch (e) {
        console.error("Error parsing message: ", e);
    }
  });
});

const findNearbyDrivers = (userLat, userLon, gender, riderGenderPreference) => {
  return Object.entries(drivers)
    .filter(([id, location]) => {
      const distance = geolib.getDistance(
        { latitude: userLat, longitude: userLon },
        location
      );
      const genderMatch = (riderGenderPreference === 'Both' || riderGenderPreference === location.gender);
      const preferenceMatch = (location.userGenderPreference === 'Both' || location.userGenderPreference === gender);
      return distance <= 6000 && genderMatch && preferenceMatch;
    })
    .map(([id, location]) => ({ id, ...location }));
};

  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


