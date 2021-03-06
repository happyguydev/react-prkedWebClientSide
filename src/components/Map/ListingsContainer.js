import React from "react";
import {Grid, Paper, withStyles} from "@material-ui/core";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import Rating from "@material-ui/lab/Rating";
import Image from "material-ui-image";

import ConfirmationPrompt from "../Map/ConfirmationPrompt";
import firebase from "../../util/firebase";

const styles = (theme) => ({
  listingItem: {
    // width: "100%",
    height: 128,
    margin: theme.spacing(1.5),
    marginBottom: 0,
    cursor: 'pointer',
    boxShadow: '0 3px 4px 0 hsl(0deg 0% 59% / 30%)',
    '&:hover': {
      transform: 'scale(1.029) !important'
    },
  },
  listingsContainer: {
    position: 'absolute',
    width: '100%',
    height: 'calc(100% - 205px)',
    background: '#efefef',
  },
});

class ListingsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: this.props.listings,
      timeDelta: this.props.timeDelta,
      hourlyPrice: false,
      dailyPrice: false,
      monthlyPrice: false,
      weeklyPrice: false,
      showConfirmationPrompt: false,
      chosenSpot: null,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      chosenLocation: this.props.chosenLocation,
      imageURL: "",
      imageLoaded: false,
    };

    this.cancelCallback = this.cancelCallback.bind(this);
  }

  cancelCallback() {
    this.setState({ showConfirmationPrompt: false, choseSpot: null });
    this.props.cancelConfirmation();
  }

  getPrice(chosenSpot) {
    let days = this.props.timeDelta / 1000 / 60 / 60 / 24;

    if (days <= 1) {
      let hours = this.props.timeDelta / 1000 / 60 / 60;
      let price = hours * chosenSpot.prices.hourly;
      if (price > chosenSpot.prices.daily_max) {
        return chosenSpot.prices.daily_max;
      } else {
        return price;
      }
    } else if (days < 7) {
      return days * chosenSpot.prices.daily_max;
    } else if (days < 30) {
      let weekly = Math.floor(days / 7.0);
      let weeklyRemainder = days % 7;

      let daily = Math.floor(weeklyRemainder);

      return weekly * chosenSpot.prices.weekly + daily * chosenSpot.prices.daily_max;
    } else {
      return (days / 30.0) * chosenSpot.prices.monthly;
    }

    /*let monthly = Math.floor(days / 30);

    let monthlyRemainder = days % 30;


    let weekly = Math.floor(monthlyRemainder / 7);

    let weeklyRemainder = weekly % 7;


    let daily = Math.floor(weeklyRemainder);





    let price =
      monthly * chosenSpot.prices.monthly +
      weekly * chosenSpot.prices.weekly +
      daily * chosenSpot.prices.daily_max;



    return price;*/
  }

  componentDidMount() {
    this.setTimeDeltaVariables();
  }

  activateConfirmationPrompt(spotId, chosenSpot, price) {
    this.setState({
      showConfirmationPrompt: true,
      chosenSpot: spotId,
      price: price,
      spot: chosenSpot,
    });
  }

  setTimeDeltaVariables() {
    let days = this.props.timeDelta / 1000 / 60 / 60 / 24;
    let [hourlyPrice, weeklyPrice, monthlyPrice, dailyPrice] = [
      false,
      false,
      false,
      false,
    ];
    if (days > 30) {
      monthlyPrice = true;
    } else if (days > 14) {
      weeklyPrice = true;
    } else if (days > 2) {
      dailyPrice = true;
    } else {
      hourlyPrice = true;
    }

    this.setState(
      {
        hourlyPrice: hourlyPrice,
        monthlyPrice: monthlyPrice,
        weeklyPrice: weeklyPrice,
        dailyPrice: dailyPrice,
      },
      () => {
      }
    );
  }

  callActiveConfirmationPrompt(spot) {
    this.activateConfirmationPrompt(spot.spotId, spot, this.getPrice(spot));
  }

  mouseHover(listing) {
    let mapPinElement = document.getElementById(
      `mapPin${listing.spotId}`
    );
    if (mapPinElement) {
      mapPinElement.classList.add('active');
    }
  }

  mouseLeave(listing) {
    let mapPinElement = document.getElementById(
      `mapPin${listing.spotId}`
    );
    if (mapPinElement) {
      mapPinElement.classList.remove('active');
    }
  }

  renderListing(listing) {
    // Creates a reference to firebase storage bucket and sets path to current spot's listing images
    var storage = firebase.storage();
    const imageRef = storage.ref(
      `listingImages/${listing.owners_uid}/${listing.spotId}/image1.jpeg`
    );

    //Using the path this downloads the image and sets it as the source for the image with id = spotId
    if (!this.state.imageLoaded) {
      imageRef
        .getDownloadURL()
        .then((url) => {
          // var img = document.getElementById(listing.spotId);
          // img.setAttribute("src", url);
          // imageURL = url;
          this.setState({ imageURL: url, imageLoaded: true });
        })
        .catch((error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/object-not-found":
              // File doesn't exist
              break;
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect the server response
              break;
            default:
              break;
          }
        });
    }

    const { imageURL } = this.state;
    const { classes } = this.props;

    return (
      <Paper
        key={listing.spotId}
        id={`spotListing${listing.spotId}`}
        className={classes.listingItem}
        onClick={() => {
          this.props.activeConfirmation();
          this.activateConfirmationPrompt(
            listing.spotId,
            listing,
            this.getPrice(listing)
          );
        }}
        onMouseEnter={() => this.mouseHover(listing)}
        onMouseLeave={() => this.mouseLeave(listing)}
      >
        <Grid container>
          <Grid item xs={4}>
            <Image
              id={listing.spotId}
              src={imageURL}
              imageStyle={{ width: 128, height: 128 }}
              alt="parking location"
            />
          </Grid>
          <Grid item xs={8}>
            <div
              style={{
                padding: "16px 12px",
                fontSize: "12px",
                height: "calc(100% - 32px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span
                  style={{
                    textTransform: "capitalize",
                    color: "#3e3e3e",
                    fontWeight: 700,
                  }}
                >
                  {listing.spot_name}
                </span>
                <span style={{ color: "#999", fontWeight: 400 }}>
                  {" "}
                  on {listing.street_name}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Rating value={listing.rating || 5} size="small" readOnly />
                <span>(45)</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <div
                  style={{
                    flex: "1 0 50%",
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: "#293038",
                  }}
                >
                  $
                  {this.state.hourlyPrice &&
                      <>
                        {Number.parseFloat(this.getPrice(listing)).toFixed(2).toString().split('.')[0]}.
                        <span style={{ fontSize: '0.7rem'}}>
                          {Number.parseFloat(this.getPrice(listing)).toFixed(2).toString().split('.')[1]}
                        </span>
                      </>
                  }
                  {this.state.weeklyPrice && listing.prices.weekly}
                  {this.state.dailyPrice && listing.prices.daily_max}
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 400,
                      color: "#999",
                      margin: "0 0 0 2px",
                    }}
                  >
                    total price
                  </p>
                </div>
                <div
                  style={{
                    flex: "1 0 50%",
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: "#293038",
                  }}
                >
                  <DirectionsWalkIcon
                      style={{
                        width: '1.25rem',
                        height: '1.25rem',
                      }}
                  /> <span>3 mins</span>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 400,
                      color: "#999",
                      margin: "0 0 0 8px",
                    }}
                  >
                    to destination
                  </p>
                </div>
                {/* <Button
                  variant="contained"
                  color="primary"
                  style={{ width: "100%" }}
                  onClick={() => {
                    this.activateConfirmationPrompt(
                      listing.spotId,
                      listing,
                      this.getPrice(listing)
                    );
                  }}
                >
                  Reserve
                </Button> */}
              </div>
            </div>
          </Grid>
        </Grid>
        {/* <Grid
          container
          style={{
            marginTop: "1.5%",
          }}
        >
          <Grid item xs={12}>
            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
                borderBottom: "1px solid",
              }}
            >
              {listing.spot_name}
            </p>
          </Grid>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            {listing.street_number} {listing.street_name} {listing.state}
          </Grid>
          <Grid item>
            <img
              id={listing.spotId}
              alt="complex"
              style={{ width: 128, height: 128 }}
            />
          </Grid>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            ${Number.parseFloat(this.getPrice(listing)).toPrecision(4)}
          </Grid>

          <Button
            variant="contained"
            color="primary"
            style={{ width: "100%" }}
            onClick={() => {
              this.activateConfirmationPrompt(
                listing.spotId,
                listing,
                this.getPrice(listing)
              );
            }}
          >
            Reserve
          </Button>
        </Grid> */}
      </Paper>
    );
  }

  render() {
    const { classes } = this.props;
    let renderedListings = [];
    if (this.state.listings) {
      for (const listing of this.props.listings) {
        renderedListings.push(this.renderListing(listing));
      }
    }

    return (
      <div
        id="listingsContainer"
        className={classes.listingsContainer}
      >
        {!this.state.showConfirmationPrompt && renderedListings}
        {this.state.showConfirmationPrompt && (
          <ConfirmationPrompt
            userId="userId"
            spotId={this.state.chosenSpot}
            imageUrl={this.state.imageURL}
            cancelCallback={this.cancelCallback}
            timeDelta={this.props.timeDelta}
            price={this.state.price}
            spot={this.state.spot}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ListingsContainer);
