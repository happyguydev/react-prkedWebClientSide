import React from "react";
import {ListItem, ListItemIcon, ListItemText, withStyles} from "@material-ui/core";
import RoomIcon from '@material-ui/icons/Room';
import GpxFixedIcon from "@material-ui/icons/GpsFixed";
import SearchIcon from '@material-ui/icons/Search';
import Autosuggest from "react-autosuggest";
import axios from "axios";

import theme from "./SearchBar.module.css";

const API_KEY = process.env.REACT_APP_API_KEY;

const styles = (theme) => ({
  filterContainer: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      '& > div:first-child': {
        borderRadius: '0px !important',
        border: 'transparent !important',
        borderBottom: '1px solid #e4e4e4 !important'
      }
    },
    '& .home-filter input': {
      padding: '28px 14px 14px 16px !important',
    }
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 18,
    width: 24,
    height: 24,
    color: '#0f7277'

  }
});

const getSuggestionValue = (suggestion) => suggestion.name;

// the elements that get created when user types in search bar
const renderSuggestion = (suggestion) => (
  <ListItem button>
    <ListItemIcon>
      <RoomIcon />
    </ListItemIcon>
    <ListItemText>{suggestion.name}</ListItemText>
  </ListItem>
);

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      suggestions: [],
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
    });

    //TODO: is choosing first one needs to choose the one that is clicked
    // when there is a click, we send a callback to the parent (home) and
    // then start the map and listing explorer
    /* if (method === "click") {
      let selection = this.state.suggestions[0];
      this.props.parentCallback(selection);
    }*/
  };

  onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    if (method === "click") {
      let selection = this.state.suggestions[suggestionIndex];
      this.props.parentCallback(selection);
    }
  };

  // whenever user edits the search bar, sends a request to google to get suggestions
  onSuggestionsFetchRequested = ({ value }) => {
    axios
      .get("/maps/api/place/autocomplete/json?", {
        params: {
          input: value,
          types: ["address"],
          language: "en",
          key: API_KEY,
        },
      })
      .then((response) => {
        let places = [];
        for (const place of response.data.predictions) {
          places.push({ name: place.description, placeId: place.place_id });
        }
        this.setState({
          suggestions: places,
        });
      })
      .catch(function (err) {
        console.log(`error reading google places api: ${err}`);
      });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const { search, classes } = this.props;

    const inputProps = {
      placeholder: this.props.value || "Where do you want to park?",
      value,
      onChange: this.onChange,
    };

    /* if (this.props.value !== "") {
      inputProps = {
        placeholder: "Search...",
        value: this.props.value,
        onChange: this.onChange,
        style,
      };
    }*/

    return (
      <div className={classes.filterContainer} >
        {search && <div style={{ border: '1px solid #c4c4c4', width: '100%', height: 54, borderRadius: 5, position: 'absolute'}} />}
        <div className={search ? 'search-filter' : 'home-filter'} style={{ marginLeft: 0, width: '100%', zIndex: '2'}} >
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            onSuggestionSelected={this.onSuggestionSelected}
            theme={theme}
          />
        </div>

        {search &&
          <SearchIcon className={classes.searchIcon} />
        }
        {search && <div className={theme.label} style={{ fontSize: 14, textTransform: 'inherit', marginTop: -15, background: '#fff', paddingLeft: 6, paddingRight: 6}}>Parking At</div>}
        {!search && <label className={theme.label}>Parking At</label>}
        {search && <GpxFixedIcon color="primary" className={theme.location} />}
      </div>
    );
  }
}

export default withStyles(styles)(SearchBar);
