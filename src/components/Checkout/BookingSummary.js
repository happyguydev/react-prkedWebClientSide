import React, {Component} from "react";

//Redux
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import CalenderSelector from "../Map/Search bar/CalendarSelector";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";

// We can inject some CSS into the DOM.
const styles = (theme) => ({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 48,
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  header: {
    background: '#21303E',
    padding: '11px 15px',
    color: '#fff',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    display: 'flex',
    fontSize: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    lineHeight: 0.2,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 20,
    }
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    fontFamily: 'Nunito, Avenir, sans-serif',
    background: '#fff',
  },
  imgRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    fontFamily: 'Nunito, Avenir, sans-serif',
    background: '#fff',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  },
  bgImg: {
    height: 130,
    width: '93%',
    borderRadius: 4,
    margin: 7,
  },
  typoGray: {
    color: "#A9A9A9",
  },
  paper: {
    background: "#F8F8F8",
    padding: '12px 0 12px 0'
  },
  text: {
    color: 'rgb(248, 249, 251)',
    fontSize: '0.6rem',
    opacity: 0.5
  },
  eduText: {
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  typoBold: {
    fontWeight: "bold",
  },
  calText: {
    color: '#999',
    fontFamily: 'Nunito, Avenir, sans-serif',
    fontSize: 12,
    lineHeight: 1,
    marginBottom: 0
  },
  timeText: {
    fontFamily: 'Nunito, Avenir, sans-serif',
    color: '#3e3e3e',
    fontSize: 18,
    marginTop: 0,
    marginBottom: -6,
    textAlign: 'center',
    fontWeight: '500'
  },
  priceText: {
    fontFamily: 'Nunito, Avenir, sans-serif',
    fontSize: 18,
    fontWeight: '300',
    color: '#999',
    marginBottom: 2
  }
});

class BookingSummary extends Component {
  state = {
    data: [],
  };

  mapBookingDetailsToState = (data) => {
    this.setState({
      data: data,
    });
  };

  componentDidMount() {
    this.setState({
      bgImages: [
        'https://uploads.justpark.com/cdn/media/uploaded/listing-photos/5ab0dea7a37fe-normal.jpg',
        'https://uploads.justpark.com/cdn/media/uploaded/listing-photos/5ab0dea7a37fe-normal.jpg',
        'https://uploads.justpark.com/cdn/media/uploaded/listing-photos/5ab0dea7a37fe-normal.jpg',
      ]
    })
    const { data } = this.props;
    this.mapBookingDetailsToState(data);
  }

  getDuration(timeDelta) {
    let duration = timeDelta / 3600000;
    return Number.parseFloat(duration.toFixed(1));
  }

  duration = this.state.data.timeDelta;

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.header}>
          <div>
            <p>Car Park</p>
            <p className={classes.text}>on St Martin's Street</p>
          </div>
          <p className={classes.eduText}>Edit location</p>
        </div>

        <Paper>
          <Grid container className={classes.imgRow}>
            {this.state.bgImages && this.state.bgImages.map((img, index) => {
              return (
                <Grid key={index} item md={6} xs={12}>
                  <img className={classes.bgImg} src={this.state.bgImages[index]} alt={`Background Image ${index}`} />
                </Grid>
              )
            })}
          </Grid>
          <div className={classes.row} style={{ marginTop: -20, marginBottom: 16 }}>
            <div>
              <p className={classes.calText}>Parking from</p>
              <CalenderSelector
                start={true}
                selectedTime={this.state.data.startDate}
              />
            </div>

            <p style={{ margin: '0 18px' }}> ➤ </p>
            <div>
              <p className={classes.calText}>Parking until</p>
              <CalenderSelector
                start={true}
                selectedTime={this.state.data.endDate}
              />
            </div>
          </div>
          <Paper className={classes.paper}>
            <p className={classes.timeText}>
              {`${this.getDuration(this.state.data.timeDelta)}h`}
            </p>
            <p className={classes.calText} style={{ textAlign: 'center' }}>Total Duration</p>
          </Paper>
          <Paper style={{padding: 18}}>
            <Typography align="right" className={classes.priceText}>Final Price: <b style={{color: '#3e3e3e'}}>${this.state.data.price}</b></Typography>
            <Typography align="right" className={classes.calText} style={{color: '#0f7277'}}>Add a promo code?</Typography>
          </Paper>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

BookingSummary.propTypes = {
  data: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(BookingSummary));
