import React, { Component } from "react";
import Axios from "axios";
import ApiRoutes from "../../../config/ApiRoutes";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { login } from "../../../actions/userInfo";
import "./index.scss";
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: 0,
      name: "",
      email: "",
      password: "",
      phone: "",
      hide: false,
      working: false,
      //0- login 1-sign up
    };
  }
  handleFormChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  toggleShowing = () => {
    if (!this.state.working)
      this.setState({
        showing: this.state.showing === 0 ? 1 : 0,
      });
  };
  signIn = () => {
    let { name, email, phone, password } = this.state;
    console.log(name);
    if (name === "" || email === "" || phone === "" || password === "") return;
    this.setState({ working: true });
    Axios.post(ApiRoutes + "user/add_user", { name, email, phone, password })
      .then((res) => {
        if (res.status === 200) {
          sessionStorage.setItem("token", res.data.token);
          this.props.login({
            _id: res.data._id,
            name,
            email,
            phone,
            token: res.data.token,
            state: "",
            city: "",
            adCredits: 0,
          });
          this.setState({ hide: true });
        } else console.log(res.data);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };
  login = () => {
    let { email, password } = this.state;
    if (email === "" || password === "") return;
    this.setState({ working: true });
    Axios.post(ApiRoutes + "user/login", {
      email,
      password,
    })
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          sessionStorage.setItem("token", res.data.token);
          this.props.login({
            _id: res.data._id,
            name: res.data.name,
            email: res.data.email,
            phone: res.data.phone,
            token: res.data.token,
            state: res.data.state || "",
            city: res.data.city || "",
            adCredits: res.data.adCredits,
          });
          this.setState({ hide: true });
        }
      })
      .catch((e) => {
        console.log(e.response);
      });
  };
  render() {
    if (this.state.hide) {
      setTimeout(this.props.closeModal, 500);
    }
    return (
      <div
        className={
          "login__container " +
          (this.state.hide ? " login__container-fadeout" : "")
        }
      >
        <div className="login__blurwall" />
        <div
          className={
            "login__contents" +
            (this.state.showing === 0 ? " login__contents-showing" : "")
          }
        >
          <div
            className="login__contents-heading"
            onClick={this.state.showing === 1 ? this.toggleShowing : null}
          >
            {this.state.showing === 0 ? "Log In" : "or Log In"}
          </div>
          <div className="login__contents-form">
            <div className="login__contents-form-textfield-container">
              <input
                type="text"
                placeholder="Email"
                name="email"
                onChange={this.handleFormChange}
                value={this.state.email}
                className="login__contents-form-textfield"
              />
            </div>
            <div className="login__contents-form-textfield-container">
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={this.handleFormChange}
                value={this.state.password}
                className="login__contents-form-textfield"
              />
            </div>
          </div>
          <button className="login__contents-loginbtn" onClick={this.login}>
            {this.state.working ? "Logging In" : "Login"}
          </button>
        </div>
        <div
          className={
            "signup__contents" +
            (this.state.showing === 1 ? " signup__contents-showing" : "")
          }
        >
          <div
            className="signup__contents-heading"
            onClick={this.state.showing === 0 ? this.toggleShowing : null}
          >
            {this.state.showing === 1 ? "Sign Up" : "or Sign Up"}
          </div>
          <div className="signup__contents-form">
            <div className="signup__contents-form-textfield-container">
              <input
                type="text"
                placeholder="Name"
                name="name"
                onChange={this.handleFormChange}
                value={this.state.name}
                className="signup__contents-form-textfield"
              />
            </div>
            <div className="signup__contents-form-textfield-container">
              <input
                type="text"
                placeholder="Email"
                name="email"
                onChange={this.handleFormChange}
                value={this.state.email}
                className="signup__contents-form-textfield"
              />
            </div>
            <div className="signup__contents-form-textfield-container">
              <input
                type="text"
                placeholder="Phone"
                name="phone"
                onChange={this.handleFormChange}
                value={this.state.phone}
                className="signup__contents-form-textfield"
              />
            </div>
            <div className="signup__contents-form-textfield-container">
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={this.handleFormChange}
                value={this.state.password}
                className="signup__contents-form-textfield"
              />
            </div>
          </div>
          <button className="signup__contents-loginbtn" onClick={this.signIn}>
            {this.state.working ? "Signing Up" : "Sign Up"}
          </button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ login }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
