import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { Tab, Tabs, withStyles } from "@material-ui/core";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import CloseIcon from "@material-ui/icons/Close";
import Rating from "@material-ui/lab/Rating";
import Lightbox from "react-image-lightbox";
import ShowMoreText from "react-show-more-text";
import "react-image-lightbox/style.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { setSpaceData } from "../../redux/actions/dataActions";

import { ReactComponent as InforBox } from "../../images/infobox.svg";
import { ReactComponent as StreetView } from "../../images/streetview.svg";
import { ReactComponent as Sheltered } from "../../images/sheltered.svg";
import { ReactComponent as CCTV } from "../../images/cctv.svg";
import { ReactComponent as Guarded } from "../../images/guarded.svg";
import { ReactComponent as Wide } from "../../images/wide.svg";
import { ReactComponent as Charging } from "../../images/charging.svg";
import { ReactComponent as Lighting } from "../../images/lighting.svg";
import { ReactComponent as Gated } from "../../images/gated.svg";

import confirmationPromptStyles from "./styles";

let facilities = {
  sheltered: true,
  cctv: true,
  guarded: true,
  wide: true,
  charging: true,
  lighting: true,
  gated: true,
};

class ConfirmationPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spot: props.spot,
      tabValue: 0,
      galleryIndex: 0,
      openGallery: false,
      facilitiesShowMore: false,
      textShowMore: false,
    };
  }

  componentDidMount() {
    this.setState((prevState) => ({
      spot: {
        ...prevState.spot,
        facilities: facilities,
        galleryImages: [
          "https://firebasestorage.googleapis.com/v0/b/prked-web.appspot.com/o/listingImages%2FVBWDCxOz6WQS5iAJryxzfW3kWSo2%2F-MP6Qdz7AuuXpCTWNKlc%2Fimage1.jpeg?alt=media&token=fc36425e-1e5b-4126-af37-e5e7efa9ad48",
          "https://firebasestorage.googleapis.com/v0/b/prked-web.appspot.com/o/listingImages%2FVBWDCxOz6WQS5iAJryxzfW3kWSo2%2F-MP6Qdz7AuuXpCTWNKlc%2Fimage1.jpeg?alt=media&token=fc36425e-1e5b-4126-af37-e5e7efa9ad48",
          "https://firebasestorage.googleapis.com/v0/b/prked-web.appspot.com/o/listingImages%2FVBWDCxOz6WQS5iAJryxzfW3kWSo2%2F-MP6Qdz7AuuXpCTWNKlc%2Fimage1.jpeg?alt=media&token=fc36425e-1e5b-4126-af37-e5e7efa9ad48",
        ],
      },
    }));
  }

  displayHumanReadableDate(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    let pm = "AM";
    if (hours >= 12) {
      pm = "PM";
      hours = hours - 12;
    }
    return `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}  ${hours}:${minutes} ${pm}`;
  }

  handleConfirm = () => {
    this.props.setSpaceData(this.props, this.props.history);
  };

  handleTabsChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  render() {
    const {
      tabValue,
      galleryIndex,
      openGallery,
      facilitiesShowMore,
      textShowMore,
    } = this.state;
    const { classes } = this.props;

    return (
      <div id="confirmationPrompt" className={classes.confirmContainer}>
        <CloseIcon
          className={classes.closeIcon}
          onClick={() => {
            this.props.cancelCallback();
          }}
        />
        <div className={classes.confirmData}>
          <div className={classes.spotName}>
            <span>RESERVABLE </span>
            <span>{this.props.spot.spot_name}</span>
            {" on "}
            <span>
              {this.props.spot.city} {this.props.state}
              {", "}
              {this.props.spot.postal_code}
            </span>
          </div>
          <div className={classes.spotRating}>
            <Rating value={this.props.spot.rating || 5} size="small" readOnly />
            <p>(45)</p>
          </div>
          <div className={classes.bookingDate}>
            <div className={classes.bookingDateDetail}>
              <span>Parking From</span>
              <span>{this.displayHumanReadableDate(this.props.startDate)}</span>
            </div>
            <div className={classes.sep} />
            <div className={classes.bookingDateDetail}>
              <span>Parking Until</span>
              <span>{this.displayHumanReadableDate(this.props.endDate)}</span>
            </div>
          </div>
          <div className={classes.standoutBar}>
            <div className={classes.standoutBarItem}>
              <div className={classes.standoutBarItemValue}>
                {this.props.timeDelta / 60 / 60 / 1000}h
              </div>
              <div className={classes.standoutBarItemTitle}>Total Duration</div>
            </div>
            <div className={classes.standoutBarItem}>
              <div className={classes.standoutBarItemValue}>
                ${Number.parseFloat(this.props.price).toFixed(2)}
              </div>
              <div className={classes.standoutBarItemTitle}>Total Price</div>
            </div>
            <div className={classes.standoutBarItem}>
              <div className={classes.standoutBarItemValue}>
                <DirectionsWalkIcon className={classes.workIcon} />
                3mins
              </div>
              <div className={classes.standoutBarItemTitle}>To Destination</div>
            </div>
          </div>
        </div>
        <Tabs
          value={tabValue}
          onChange={this.handleTabsChange}
          variant="fullWidth"
          indicatorColor="primary"
          aria-label="Information"
          className={classes.tabs}
        >
          <Tab label="Information" {...a11yProps(0)} className={classes.tab} />
          <Tab label="Reviews" {...a11yProps(1)} className={classes.tab} />
          <Tab label="How to Park" {...a11yProps(2)} className={classes.tab} />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <div className={classes.tabContent}>
            <div className={classes.inforBox}>
              <div>
                <InforBox />
              </div>
              <p>
                Inside Congestion Charge Zone £15 per day. Click{" "}
                <a href="#">here</a> to learn how to pay this.
              </p>
            </div>
            <ul className={classes.facilities}>
              {this.state.spot.facilities &&
                Object.keys(this.state.spot.facilities).map(
                  (keyName, index) => {
                    if (this.state.spot.facilities[keyName]) {
                      if (
                        !facilitiesShowMore &&
                        Object.keys(this.state.spot.facilities).length > 4 &&
                        index === 3
                      ) {
                        return (
                          <li key={index}>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                this.setState({ facilitiesShowMore: true })
                              }
                            >
                              <p className={classes.facilitiesCount}>
                                +
                                {Object.keys(this.state.spot.facilities)
                                  .length - 3}
                              </p>
                              <p className={classes.facilitiesText}>
                                Show All Facilities
                              </p>
                            </div>
                          </li>
                        );
                      }
                      if (
                        facilitiesShowMore ||
                        Object.keys(this.state.spot.facilities).length <= 4 ||
                        (Object.keys(this.state.spot.facilities).length > 4 &&
                          index < 3)
                      ) {
                        return (
                          <li key={index}>
                            {keyName === "sheltered" ? (
                              <>
                                <Sheltered />
                                <p>Sheltered</p>
                              </>
                            ) : keyName === "cctv" ? (
                              <>
                                <CCTV />
                                <p>CCTV</p>
                              </>
                            ) : keyName === "wide" ? (
                              <>
                                <Wide />
                                <p>Wide</p>
                              </>
                            ) : keyName === "charging" ? (
                              <>
                                <Charging />
                                <p>Charging</p>
                              </>
                            ) : keyName === "lighting" ? (
                              <>
                                <Lighting />
                                <p>Lighting</p>
                              </>
                            ) : keyName === "guarded" ? (
                              <>
                                <Guarded />
                                <p>Guarded</p>
                              </>
                            ) : (
                              <>
                                <Gated />
                                <p>Gated</p>
                              </>
                            )}
                          </li>
                        );
                      }
                    }
                  }
                )}
            </ul>
            <div className={classes.content}>
              <ShowMoreText
                lines={3}
                more="Read more"
                less="Read less"
                anchorClass={`showText ${!textShowMore ? "more" : "less"}`}
                onClick={() =>
                  this.setState((prev) => ({
                    textShowMore: !prev.textShowMore,
                  }))
                }
                expanded={false}
              >
                {this.props.spot.description}
              </ShowMoreText>
            </div>

            <Link
              to={{
                pathname: "/streetview",
                state: {
                  lat: this.state.spot.streetview_lat,
                  long: this.state.spot.streetview_long,
                },
              }}
            >
              <Button variant="outlined" className={classes.streetView}>
                <StreetView />
                View streetview
              </Button>
            </Link>

            <div className={classes.gallery}>
              {this.state.spot.galleryImages &&
                this.state.spot.galleryImages.map((galleryItem, index) => {
                  return (
                    index < 2 && (
                      <div
                        key={index}
                        className={classes.galleryItem}
                        onClick={() => this.setState({ openGallery: true })}
                      >
                        <img src={galleryItem} alt={"Gallery" + index} />
                      </div>
                    )
                  );
                })}
              {openGallery && (
                <Lightbox
                  mainSrc={this.state.spot.galleryImages[galleryIndex]}
                  nextSrc={
                    this.state.spot.galleryImages[
                      (galleryIndex + 1) % this.state.spot.galleryImages.length
                    ]
                  }
                  prevSrc={
                    this.state.spot.galleryImages[
                      (galleryIndex +
                        this.state.spot.galleryImages.length -
                        1) %
                        this.state.spot.galleryImages.length
                    ]
                  }
                  onCloseRequest={() => this.setState({ openGallery: false })}
                  onMovePrevRequest={() =>
                    this.setState({
                      galleryIndex:
                        (galleryIndex +
                          this.state.spot.galleryImages.length -
                          1) %
                        this.state.spot.galleryImages.length,
                    })
                  }
                  onMoveNextRequest={() =>
                    this.setState({
                      galleryIndex:
                        (galleryIndex + 1) %
                        this.state.spot.galleryImages.length,
                    })
                  }
                />
              )}
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <div className={classes.tabContent}>
            <ul className={classes.reviews}>
              <li>
                <div className={classes.reviewPhoto}>
                  <img src="avatar.png" alt="" />
                </div>
                <div className={classes.review}>
                  <h6>Neera</h6>
                  <p className={classes.reviewDate}>22nd June 2021</p>
                  <Rating
                    value={this.props.spot.rating || 5}
                    size="small"
                    readOnly
                  />
                  <ShowMoreText
                    lines={6}
                    more="Read more"
                    less="Read less"
                    className={classes.reviewDetail}
                    anchorClass={`showText ${!textShowMore ? "more" : "less"}`}
                    onClick={() =>
                      this.setState((prev) => ({
                        textShowMore: !prev.textShowMore,
                      }))
                    }
                    expanded={false}
                  >
                    FOR SMALL/MEDIUM CARS ONLY. I was very lucky I have a Tiguan
                    with surround cameras but it took me more than 4 attempts to
                    get the car in past the gates. Then several attempts to get
                    out of the gates! The parking spaces is only for
                    small/medium cars also, about maybe 12 spaces on total. Same
                    way you come in you must go out. I now know why it's cheap
                    to park here and why there offer insurance to cover your
                    excess. They do mention the above in the description, but it
                    can missed very easily. I give it 2 stars due to what I went
                    through as my car is a medium SUV.
                  </ShowMoreText>
                </div>
              </li>
              <li>
                <div className={classes.reviewPhoto}>
                  <img src="avatar.png" alt="" />
                </div>
                <div className={classes.review}>
                  <h6>Neera</h6>
                  <p className={classes.reviewDate}>22nd June 2021</p>
                  <Rating
                    value={this.props.spot.rating || 5}
                    size="small"
                    readOnly
                  />
                  <ShowMoreText
                    lines={6}
                    more="Read more"
                    less="Read less"
                    className={classes.reviewDetail}
                    anchorClass={`showText ${!textShowMore ? "more" : "less"}`}
                    onClick={() =>
                      this.setState((prev) => ({
                        textShowMore: !prev.textShowMore,
                      }))
                    }
                    expanded={false}
                  >
                    Very tight to get into entrance , The car park spaces are
                    very limited and was lucky to get a space i paid for, and
                    the car park stinks of URINE.
                  </ShowMoreText>
                </div>
              </li>
            </ul>
          </div>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <div className={classes.tabContent}>
            <div className={classes.park}>
              <ul>
                <li>
                  <img
                    src="https://static.justpark.com/web/assets/how_to_park_step_1.ce4b0e3678d133c8d1a6eacc7a2cac2c.svg"
                    alt=""
                  />
                  <div>
                    <p>Once you've paid</p>
                    <p>
                      You'll receive directions to the space and information on
                      how to access it
                    </p>
                  </div>
                </li>
                <li>
                  <img
                    src="https://static.justpark.com/web/assets/how_to_park_step_2.52e2e3afd128227abee1de544b2a82a1.svg"
                    alt=""
                  />
                  <div>
                    <p>
                      You'll receive directions to the space and information on
                      how to access it
                    </p>
                  </div>
                </li>
                <li>
                  <img
                    src="https://static.justpark.com/web/assets/how_to_park_step_3.694fd32d112fe4920944161ef0d75ed7.svg"
                    alt=""
                  />
                  <div>
                    <p>
                      You'll receive directions to the space and information on
                      how to access it
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </TabPanel>
        <div className={classes.confirmSelect}>
          <Button variant="contained" onClick={this.handleConfirm}>
            Reverse for ${Number.parseFloat(this.props.price).toFixed(2)}
          </Button>
        </div>
      </div>
    );
  }
}

ConfirmationPrompt.propTypes = {
  setSpaceData: PropTypes.func.isRequired,
};

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

const mapActionsToProps = {
  setSpaceData,
};

const mapStateToProps = (state) => ({
  listing: state.listing,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps
  )(withStyles(confirmationPromptStyles)(ConfirmationPrompt))
);
