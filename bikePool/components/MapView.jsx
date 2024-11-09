import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapViewComponent = ({ pickupLat, pickupLng }) => {
  const [region, setRegion] = useState({
    latitude: pickupLat,
    longitude: pickupLng,
    latitudeDelta: 0.0922,  // Adjust to change zoom level
    longitudeDelta: 0.0421,
  });

  const onRegionChangeComplete = (region) => {
    setRegion(region);
  };

  return (
    <View style={styles.container}>
      <MapView
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        style={styles.map}
      >
        <Marker
          coordinate={{ latitude: pickupLat, longitude: pickupLng }}
          title="Pickup Location"
          description="This is where you'll be picked up."
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapViewComponent;
