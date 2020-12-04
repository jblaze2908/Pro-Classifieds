import React, { Component } from "react";
import "./index.scss";
import Select from "react-select";
import Logo from "../../../assets/logo/logo.svg";
import Axios from "axios";
import LoginModal from "../LoginModal";
import ReactModal from "react-modal";
import NavDropdown from "./NavDropdown";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
let categoryOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Fashion",
    value: "fashion",
  },
  {
    label: "Vehicle",
    value: "vehicle",
  },
  {
    label: "Furniture",
    value: "furniture",
  },
  {
    label: "Electronics",
    value: "electronics",
  },
  {
    label: "Mobiles",
    value: "mobiles",
  },
  {
    label: "Books/Sports",
    value: "books/sports",
  },
  {
    label: "Services",
    value: "services",
  },
];
class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginModalShow: false,
      navdropdown_open: false,
      locationValue: {
        label: "Select Location...",
        value: "Select Location...",
      },
    };
  }
  changeLocation = (val) => {
    if (val.value === "getCurLoc") {
      this.getLocation();
    } else this.setState({ locationValue: val });
  };
  getLocation = () => {
    this.setState({
      locationValue: {
        label: "Getting your location...",
        value: "Getting your location...",
      },
    });
    let navigator = window.navigator;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getAddress);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  getAddress = async (position) => {
    console.log(position);
    const { latitude, longitude } = position.coords;
    console.log(latitude);
    const key = "QxJyC3fKLZuz0JjJPhGiKqvw0ebnbB8C";
    let response = await Axios.get(
      "http://open.mapquestapi.com/geocoding/v1/reverse?key=" +
        key +
        "&location=" +
        latitude +
        "," +
        longitude +
        "&includeRoadMetadata=true&includeNearestIntersection=true"
    );
    const address = response.data.results[0].locations[0].adminArea5;
    this.setState({
      locationValue: {
        label: address,
        value: address,
      },
    });
    console.log(address);
  };
  toggleLoginModal = () => {
    this.setState({
      loginModalShow: !this.state.loginModalShow,
    });
  };
  render() {
    console.log(this.props);
    return (
      <div className="navbar__container">
        <Link to="/" className="navbar__brand-container">
          <div className="navbar__brand-logo">
            <img src={Logo} alt="" />
          </div>
        </Link>
        {this.props.location.pathname === "/" ? (
          <div className="navbar__middle-container">
            <div className="navbar__area-container">
              <Select
                placeholder="Select Location..."
                onChange={this.changeLocation}
                options={[
                  {
                    label: "Get Current Location",
                    value: "getCurLoc",
                  },
                  {
                    label: "Delhi",
                    value: "Delhi",
                  },
                  {
                    label: "Mumbai",
                    value: "Mumbai",
                  },
                  {
                    label: "Kolkata",
                    value: "Kolkata",
                  },
                ]}
                value={this.state.locationValue}
              ></Select>
            </div>
            <div className="navbar__searchbar-container">
              <Select
                className="navbar__searchbar-textfield"
                options={categoryOptions}
                placeholder="Select Category"
                onChange={(e) => {
                  this.setState({ category: e.value });
                }}
              />
            </div>
          </div>
        ) : (
          <div className="navbar__middle-container" />
        )}
        <div className="navbar__login">
          {!this.props.userInfo.token ? (
            <button
              className="navbar__login-btn"
              onClick={
                !this.props.userInfo.token ? this.toggleLoginModal : null
              }
            >
              Login
            </button>
          ) : (
            <div
              className="navbar__login-username"
              onMouseOver={() => {
                this.setState({ navdropdown_open: true });
              }}
              onMouseLeave={() => {
                this.setState({ navdropdown_open: false });
              }}
            >
              {this.props.userInfo.name}
              <div className="navbar__login-dropdown">
                <NavDropdown open={this.state.navdropdown_open} />
              </div>
            </div>
          )}
        </div>
        <ReactModal
          ariaHideApp={false}
          isOpen={this.state.loginModalShow}
          onRequestClose={this.toggleLoginModal}
          className="loginModal__container"
          overlayClassName="loginModal__overlay"
        >
          <LoginModal closeModal={this.toggleLoginModal} />
        </ReactModal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(index));
