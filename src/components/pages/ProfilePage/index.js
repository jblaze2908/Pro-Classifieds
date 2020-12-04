import React, { Component } from "react";
import Select from "react-select";
import StateOptions from "../../../utlities/indianStates";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./index.scss";
import Axios from "axios";
import ApiRoutes from "../../../config/ApiRoutes";
import { updateProfile } from "../../../actions/userInfo";
import { Link } from "react-router-dom";
import { titleCase } from "../../../utlities/preDefinedFunctions";
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityOptions: [],
      selectedCity: this.props.userInfo.city,
      selectedState: this.props.userInfo.state,
    };
  }
  componentDidMount = () => {
    this.getCitiesFirstLoad();
  };
  getCitiesFirstLoad = () => {
    if (this.props.userInfo.state) {
      if (this.props.userInfo.state && !this.state.selectedCity)
        this.getCitiesByState(
          this.props.userInfo.state,
          this.props.userInfo.city
        );
      else this.getCitiesByState(this.props.userInfo.state);
    } else {
      if (sessionStorage.getItem("token")) {
        console.log("running");
        setTimeout(this.getCitiesFirstLoad, 1000);
        return;
      }
    }
  };
  getCitiesByState = (state, city) => {
    Axios.get(ApiRoutes + "utility/getAllCity/" + state).then((res) => {
      if (!city)
        this.setState({
          cityOptions: [...res.data.citiesByState],
          selectedState: state,
          selectedCity: "",
        });
      else
        this.setState({
          cityOptions: [...res.data.citiesByState],
          selectedState: state,
          selectedCity: city,
        });
    });
  };
  updateCity = (e) => {
    this.setState({ selectedCity: e.value });
  };
  updateProfile = () => {
    if (
      this.state.selectedState === "" ||
      this.state.selectedCity === "" ||
      (this.state.selectedCity === this.props.userInfo.city &&
        (this.state.selectedState === this.props.userInfo.state ||
          this.state.selectedCity === ""))
    )
      return;
    let { selectedCity, selectedState } = this.state;
    Axios.post(
      ApiRoutes + "user/update_profile",
      { city: selectedCity, state: selectedState },
      {
        headers: {
          authorization: this.props.userInfo.token,
        },
      }
    ).then((res) => {
      if (res.status === 200)
        this.props.updateProfile({
          city: selectedCity,
          state: selectedState,
        });
    });
  };
  render() {
    return (
      <div className="profilepage__container">
        <div className="profilepage__header">User Profile</div>
        <div className="profilepage__form">
          <div className="profilepage__form-label">Name</div>
          <input
            type="text"
            className="profilepage__form-textfield"
            readOnly={true}
            value={this.props.userInfo.name}
          />
          <div className="profilepage__form-label">Contact Number</div>
          <input
            type="text"
            className="profilepage__form-textfield"
            readOnly={true}
            value={this.props.userInfo.phone}
          />
          <div className="profilepage__form-label">Email</div>
          <input
            type="text"
            className="profilepage__form-textfield"
            readOnly={true}
            value={this.props.userInfo.email}
          />
          <div className="profilepage__form-label">State</div>
          <Select
            options={StateOptions}
            onChange={(e) => {
              this.getCitiesByState(e.value);
            }}
            value={{
              value: this.state.selectedState,
              label: this.state.selectedState,
            }}
          />
          <div className="profilepage__form-label">City</div>
          <div className="profilepage__form-city-container">
            <Select
              options={this.state.cityOptions}
              onChange={this.updateCity}
              value={{
                value: this.state.selectedCity,
                label: titleCase(this.state.selectedCity),
              }}
            />
            <button
              className={
                "profilepage__form-btn profilepage__form-btn-update " +
                (this.state.selectedState === "" ||
                this.state.selectedCity === "" ||
                (this.state.selectedCity === this.props.userInfo.city &&
                  (this.state.selectedState === this.props.userInfo.state ||
                    this.state.selectedCity === ""))
                  ? " profilepage__form-btn-disabled"
                  : "")
              }
              onClick={this.updateProfile}
            >
              Update
            </button>
          </div>
          <div className="profilepage__form-label">Number of Ad Credits</div>
          <div className="profilepage__form-ad">
            <input
              type="text"
              className="profilepage__form-textfield"
              readOnly={true}
              value={this.props.userInfo.adCredits}
            />
            <Link to="/adcredits/purchase" className="profilepage__form-btn">
              Buy More
            </Link>
          </div>
        </div>
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
  return bindActionCreators({ updateProfile }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
