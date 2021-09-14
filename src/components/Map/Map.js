import React from "react";
import GoogleMapReact from "google-map-react";

import MapPin from "./MapPin";

import { mapStyles } from './styles';

const API_KEY = process.env.REACT_APP_API_KEY;

function Map({ chosenLocation, listings, timeDelta, onClickMapPin }) {

  const zoomLevel = 15;

  const styles = mapStyles();

  function getPrice(chosenSpot) {
    let days = timeDelta / 1000 / 60 / 60 / 24;

    if (days <= 1) {
      let hours = timeDelta / 1000 / 60 / 60;
      let price = hours * chosenSpot.prices.hourly;
      if (price > chosenSpot.prices.daily_max) {
        return chosenSpot.prices.daily_max;
      } else {
        return price;
      }
    }

    let monthly = Math.floor(days / 30);
    let monthlyRemainder = days % 30;

    let weekly = Math.floor(monthlyRemainder / 7);
    let weeklyRemainder = weekly % 7;

    let daily = Math.floor(weeklyRemainder);


    return monthly * chosenSpot.prices.monthly +
        weekly * chosenSpot.prices.weekly +
        daily * chosenSpot.prices.daily_max;
  }

  const handleClickedMapPin = (spot) => {
    onClickMapPin(spot);
  }

  function renderPin(spot, price) {
    return (
      <MapPin
        key={spot.spotId}
        lat={spot.l[0]}
        lng={spot.l[1]}
        text={spot.spot_name}
        onClickedMapPin={() => handleClickedMapPin(spot)}
        spotInfo={spot}
        price={price}
      />
    );
  }

  function renderListingPins(listings) {
    let renderedPins = [];
    for (const spot of listings) {
      let price = getPrice(spot);
      renderedPins.push(renderPin(spot, price));
    }
    return renderedPins;
  }

  return (
      <div id="mainMap" className={styles.mainMap}>
        <GoogleMapReact
          resetBoundsOnResize={true}
          bootstrapURLKeys={{ key: API_KEY }}
          center={chosenLocation}
          defaultZoom={zoomLevel}
        >
          {listings.length && renderListingPins(listings)}
        </GoogleMapReact>
      </div>
  );
}

export default Map;
