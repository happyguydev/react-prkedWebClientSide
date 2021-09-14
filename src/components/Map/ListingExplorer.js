import React from "react";
import firebase from "firebase/app";
import { GeoFire } from "geofire";
import { Drawer, Tabs, Tab, withStyles } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Moment from "moment";
import { extendMoment } from "moment-range";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import Button from "@material-ui/core/Button";

import Map from "../Map/Map";
import ListingsContainer from "../Map/ListingsContainer";

import { SpaceAvailabilityCheck } from "../../util/SpaceAvailabilityCheck";
import { CheckIfAlreadyReserved } from "../../util/CheckIfAlreadyReserved";

import { listingExplorerStyles } from './styles';

const moment = extendMoment(Moment);

class ListingExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listings: [],
      chosenLocation: props.chosenLocation,
      timeDelta: props.timeDelta,
      startDate: props.startDate,
      endDate: props.endDate,
      tabValue: 0,
      selectedSpot: {},
      confirmation: false,
    };
    this.listingsContainerRef = React.createRef();
  }

  changeTime = (start, end) => {
    /* this.setState({
      listings: [],
      startDate: start,
      endDate: end,
      timeDelta: end - start,
    });*/

    this.getListings(0);
    this.render();
  };

  async getListings(n) {

    // TO DO
    // make it so it pulls 10 listings at a time, starting at n*10
    // having a page feature, where you click next, get 10
    // to save $$$ on firebase pulls
    let database = firebase.database();
    let upcoming = [];

    //ref to 'Upcoming_bookings' in firebase
    let dbRef = firebase.database().ref("Upcoming_Bookings");



    //Firebase ref to 'spots' location
    let spotRef = database.ref("Spots");

    //Geofire ref for location query
    let geoFire = new GeoFire(spotRef);

    //Coordinates from user's search locations
    let lat = this.props.chosenLocation.lat;
    let lng = this.props.chosenLocation.lng;
    let coords = [lat, lng];


    //Stores keys of spots within the search radius
    let spotKeys = [];

    // Create a GeoQuery centered at search location with radius = 40km
    let geoQuery = geoFire.query({
      center: coords,
      radius: 40,
    });

    //Used to compare user's time range with each spot's availability to only display spots that are available during that time
    let startDate = this.props.startDate;
    let endDate = this.props.endDate;

    //For every spot in the query the spotId is pushed to spotKeys[] and prints info for testing purposes
    let onKeyEnteredRegistration = geoQuery.on(
      "key_entered",
      function (key, location, distance) {
        spotKeys.push(key);
      }
    );

    //Stores listing information for spaces within the query
    let listings = [];

    this.state.listings = [];

    //Retrieves spots from firebase and adds them to the listings[] if their spotId is in spotKeys[]
    let dataSnapshot = database.ref("Spots");
    dataSnapshot.once('value').then((parent) => {
      parent.forEach((child) => {
        let childData = child.val();
        if (spotKeys.includes(child.key)) {
          let available = SpaceAvailabilityCheck(
            child.child("availability").val(),
            startDate,
            endDate
          );
          let reserved = false;
          //may put this in its own file to check upcoming bookings but having trouble doing it within another query
           /*dbRef.child(child.key).on('value', (snapshot) => {
            if (snapshot.exists()) {

                upcoming = snapshot.val();

                snapshot.forEach((child) => {
                  let bookingStart = new Date(child.child("startTime").val());
                  let bookingEnd = new Date(child.child("endTime").val());
                  let range = moment.range(bookingStart, bookingEnd);

                  if(range.contains(startDate) || range.contains(endDate)) {
                      reserved = true;
                      return true;
                  } else {
                    reserved = false;
                  }
                })
            } else {
                reserved = false;
            }
          });*/

          //var spotId = childData["spotId"];
          //reserved = await CheckIfAlreadyReserved(spotId, startDate, endDate);
          let verified = childData["address_is_verified"];
          if (available === true && verified === true && reserved === false) {

            listings.push(childData);
          }
        }
      });
      this.setState({
        listings: listings,
      });
      //this.showProperSpots(listings);
    });
  }

  //Need to fix this to make it async with getListings()
  showProperSpots = (listings) => {
    let startDate = this.props.startDate;
    let endDate = this.props.endDate;
    let dbRef = firebase.database().ref("Upcoming_Bookings");
    let realListings = [];
    for(let i = 0; i < listings.length; i++)
    dbRef.child(listings[i].spotId).on('value', (snapshot) => {
      if (snapshot.exists()) {


          snapshot.forEach((child) => {
            let bookingStart = new Date(child.child("startTime").val());
            let bookingEnd = new Date(child.child("endTime").val());
            let range = moment.range(bookingStart, bookingEnd);

            if(range.contains(startDate) || range.contains(endDate)) {
                //reserved = true;
                return true;
            } else {
              realListings.push(listings[i]);
              //reserved = false;
            }
          })
      } else {
        realListings.push(listings[i]);
        //reserved = false;
      }
      this.setState({
        listings: realListings,
      });
    });
  }

  componentDidMount() {

    // this is a react thing that runs before component is rendered
    // that way it pulls the data first and then renders
    this.getListings(0);
  }

  handleClickMapPin(spot) {
    this.setState({
      selectedSpot: spot,
    });
    this.listingsContainerRef.current.callActiveConfirmationPrompt(
      spot
    );
  }

  showSelectedSpot() {
    this.setState({
      confirmation: true,
    });
  }

  cancelCallback() {
    this.setState({
      selectedSpot: {},
      confirmation: false,
    });
  }

  handleActiveConfirmation() {
    this.setState({
      confirmation: true,
    })
  }

  render() {
    /* if (this.state.listings.length === 0) {
      return null;
    }*/
    const { tabValue, selectedSpot, confirmation } = this.state;
    const { classes } = this.props;
    const cheapestListings = [...this.state.listings].sort((a, b) => a.prices["hourly"] - b.prices["hourly"]);
    const handleTabsChange = (event, newValue) => {
      this.setState({ tabValue: newValue });
    };

    return (
      <>
        <Drawer
          className={!confirmation ? classes.listings : classes.activeListings}
          variant="persistent"
          anchor="left"
          open
          classes={{
            paper: classes.listingsPaper,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabsChange}
            variant="fullWidth"
            indicatorColor="primary"
            aria-label="BEST MATCH"
            className={classes.tabs}
          >
            <Tab label="BEST MATCH" {...a11yProps(0)} className={classes.tab} />
            <Tab label="CHEAPEST" {...a11yProps(1)} className={classes.tab} />
            <Tab label="CLOSEST" {...a11yProps(2)} className={classes.tab} />
          </Tabs>
          <TabPanel value={tabValue} index={0} >
            <ListingsContainer
              ref={this.listingsContainerRef}
              listings={this.state.listings}
              timeDelta={this.props.timeDelta}
              startDate={this.props.startDate}
              endDate={this.props.endDate}
              chosenLocation={this.props.chosenLocation}
              activeConfirmation={() => this.handleActiveConfirmation()}
              cancelConfirmation={() => this.cancelCallback()}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ListingsContainer
              ref={this.listingsContainerRef}
              listings={cheapestListings}
              timeDelta={this.props.timeDelta}
              startDate={this.props.startDate}
              endDate={this.props.endDate}
              chosenLocation={this.props.chosenLocation}
              activeConfirmation={() => this.handleActiveConfirmation()}
              cancelConfirmation={() => this.cancelCallback()}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            Closest Locations
          </TabPanel>
        </Drawer>

        {Object.keys(selectedSpot).length > 0 &&
          <div className={classes.spotData} onClick={() => this.showSelectedSpot()}>
            <div className={classes.spotName}>
              <span>{selectedSpot.spot_name}</span>
              {' on '}
              <span>
                {selectedSpot.city} {selectedSpot.state}
                {", "}
                {selectedSpot.postal_code}
              </span>
            </div>
            <div className={classes.spotRating}>
              <Rating value={selectedSpot.rating || 5} size="small" readOnly />
              <p>(45)</p>
            </div>
            <div className={classes.minutes}>
              <DirectionsWalkIcon className={classes.workIcon}/>
              {'3mins • '}
              <span>&nbsp;{'RESERVABLE'}</span>
            </div>
            <Button
              variant="contained"
              className={classes.selectButton}
            >
              View details & reserve
            </Button>
          </div>
        }

        <Map
          chosenLocation={this.props.chosenLocation}
          listings={this.state.listings}
          timeDelta={this.props.timeDelta}
          onClickMapPin={(spot) => this.handleClickMapPin(spot)}
        />
      </>
    );
  }
}

function a11yProps(index) {
  return {
    id: `listings-tab-${index}`,
    "aria-controls": `listings-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`listings-tabpanel-${index}`}
      aria-labelledby={`listings-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default withStyles(listingExplorerStyles)(ListingExplorer);
