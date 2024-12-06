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
                lastUpdated: new Date().getTime()
            };
            console.log("Updated driver location: ", drivers[data.driver]);
        }

        if (data.type === "requestRide" && data.role === "user") {
            console.log("Requesting ride...");
            const nearbyDrivers = findNearbyDrivers(data.latitude, data.longitude);
            ws.send(
              JSON.stringify({ type: "nearbyDrivers", drivers: nearbyDrivers })
            );
        } 

        if(data.type === "getDriverLocation" && data.role === "user"){
            ws.send(JSON.stringify({ type: "driverLiveLocationWithId", location: drivers[data.driverId] }));
            console.log("Sending driver location to user: ", drivers[data.driverId]);
        }
    } catch (e) {
        console.error("Error parsing message: ", e);
    }
  });
});

const findNearbyDrivers = (userLat, userLon) => {
  console.log("Drivers: ", drivers);
    return Object.entries(drivers)
      .filter(([id, location]) => {
        const distance = geolib.getDistance(
          { latitude: userLat, longitude: userLon },
          location
        );
        // return distance <= 6000 && (new Date().getTime() - location.lastUpdated) <= 5000;
        return distance <= 6000;
      })
      .map(([id, location]) => ({ id, ...location }));
};
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});