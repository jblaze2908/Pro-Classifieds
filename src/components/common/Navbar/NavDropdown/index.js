import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactModal from "react-modal";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { logout } from "../../../../actions/userInfo";
import "./index.scss";
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoutConfirmation: false,
    };
  }
  logout = () => {
    this.props.logout();
    this.hideLogoutConfirmation();
  };
  showLogoutConfirmation = () => {
    this.setState({ logoutConfirmation: true });
  };
  hideLogoutConfirmation = () => {
    this.setState({ logoutConfirmation: false });
  };
  render() {
    return (
      <React.Fragment>
        <div
          className={
            "navbar__dropdown-container" +
            (this.props.open
              ? " navbar__dropdown-container-open"
              : " navbar__dropdown-container-closed")
          }
        >
          <div className="navbar__dropdown-arrow" />
          <div className="navbar__dropdown-links">
            <Link to="/product/add_new" className="navbar__dropdown-link">
              Add new Listing
            </Link>
            <Link to="/my_listings" className="navbar__dropdown-link">
              My Listings
            </Link>
            <Link to="/profile" className="navbar__dropdown-link">
              My Profile
            </Link>
            <button
              className="navbar__dropdown-link"
              onClick={this.showLogoutConfirmation}
            >
              Logout
            </button>
          </div>
        </div>
        <ReactModal
          ariaHideApp={false}
          isOpen={this.state.logoutConfirmation}
          className="logoutconfirmation__modal"
          overlayClassName="logoutconfirmation__modal-overlay"
        >
          <div className="logoutconfirmation__container">
            <div className="logoutconfirmation__text">
              Are you sure you want to logout?
            </div>
            <div className="logoutconfirmation__btns">
              <button
                className="logoutconfirmation__btns-yes"
                onClick={this.logout}
              >
                Yes
              </button>
              <button
                className="logoutconfirmation__btns-cancel"
                onClick={this.hideLogoutConfirmation}
              >
                Cancel
              </button>
            </div>
          </div>
        </ReactModal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      logout,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
