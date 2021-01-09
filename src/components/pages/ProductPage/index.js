import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import ReactModal from "react-modal";
import "./index.scss";
import Axios from "axios";
import { Link } from "react-router-dom";
import ApiRoutes from "../../../config/ApiRoutes";
import {
  titleCase,
  addDaysToDate,
  checkIfFeatured,
} from "../../../utlities/preDefinedFunctions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateProfile } from "../../../actions/userInfo";
import { start_chat } from "../../../actions/chats";
import SoldOverlay from "../../../assets/images/sold.png";
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImg: "",
      images: [],
      isFeatured: false,
      featuredTillDate: "",
      askingPrice: "",
      createdAt: "",
      description: "",
      sellerDetails: { _id: "", name: "", state: "", city: "" },
      title: "",
      product_id: "",
      status: "",
      listingOwner: false,
      deleteListing: false,
      userfound: false,
      username: "",
      user_id: "",
      findEmail: "",
      showSoldPopup: false,
      soldTo: "",
      showBoostVisibility: false,
    };
  }
  handleCloseModal = () => {
    this.setState({ selectedImg: "" });
  };
  loadListingData = (productId) => {
    let token =
      this.props.userInfo.token || sessionStorage.getItem("token") || "";
    Axios.get(ApiRoutes + "listing/fetch_listing_detail/" + productId, {
      headers: { authorization: token },
    }).then((res) => {
      let data = res.data;
      if (res.status === 200) {
        let listingOwner = false;
        if (this.props.userInfo.token) {
          if (res.data.sellerId._id === this.props.userInfo._id)
            listingOwner = true;
        }
        this.setState({
          images: [...data.images],
          askingPrice: data.askingPrice,
          createdAt: new Date(data.createdAt),
          product_id: data._id,
          description: data.description,
          sellerDetails: data.sellerId,
          title: data.title,
          status: data.status,
          soldTo: data.soldTo,
          listingOwner,
          isFeatured: data.isFeatured,
          featuredTillDate: data.featuredTillDate,
        });
      }
    });
  };
  toggleShowSoldPopup = () => {
    this.setState({ showSoldPopup: !this.state.showSoldPopup });
  };
  toggleDeleteListing = () => {
    this.setState({ deleteListing: !this.state.deleteListing });
  };
  toggleBoostVisibility = () => {
    this.setState({ showBoostVisibility: !this.state.showBoostVisibility });
  };
  deleteListing = () => {
    Axios.post(
      ApiRoutes + "listing/delete_listing",
      { productId: this.props.match.params.id },
      { headers: { authorization: this.props.userInfo.token } }
    ).then((res) => {
      if (res.status === 200) {
        this.props.history.push("/");
      }
    });
  };
  findUserByEmail = () => {
    Axios.get(ApiRoutes + "user/find_user_by_email/" + this.state.findEmail, {
      headers: { authorization: this.props.userInfo.token },
    }).then((res) => {
      if (res.status === 200) {
        this.setState({
          userfound: true,
          username: res.data.name,
          user_id: res.data._id,
        });
      } else this.setState({ userfound: false, username: res.data.message });
    });
  };
  setListingAsSold = () => {
    Axios.post(
      ApiRoutes + "listing/set_listing_as_sold",
      { productId: this.props.match.params.id, buyerId: this.state.user_id },
      { headers: { authorization: this.props.userInfo.token } }
    ).then((res) => {
      if (res.status === 200) {
        this.setState({ status: "Sold", showSoldPopup: false });
      }
    });
  };
  setListingAsFeatured = () => {
    Axios.post(
      ApiRoutes + "listing/set_listing_as_featured",
      { productId: this.props.match.params.id },
      { headers: { authorization: this.props.userInfo.token } }
    ).then((res) => {
      if (res.status === 200) {
        this.props.updateProfile({ adCredits: res.data.adCredits });
        this.setState({ showBoostVisibility: false });
      }
    });
  };
  startChat = () => {
    if (!this.props.userInfo.token) return;
    let data = {
      _id: this.state.sellerDetails._id,
      name: this.state.sellerDetails.name,
      product_id: this.state.product_id,
      productName: this.state.title,
    };
    this.props.start_chat(data);
    this.props.history.push("/chats/" + data.product_id);
  };
  componentDidUpdate(prevProps) {
    if (!this.props.userInfo.token && this.state.listingOwner) {
      this.setState({ listingOwner: false });
    } else if (
      this.props.userInfo.token &&
      this.props.userInfo._id === this.state.sellerDetails._id &&
      !this.state.listingOwner
    )
      this.setState({ listingOwner: true });
  }
  componentDidMount() {
    this.loadListingData(this.props.match.params.id);
  }
  render() {
    return (
      <div className="productpage__container">
        <div className="productpage__mainrow">
          <div className="productpage__left">
            <div className="productpage__left-image">
              <div className="productpage__left-image-content">
                <div className="productpage__left-image-carousel">
                  {this.state.status === "Sold" ? (
                    <div className="sold-overlay">
                      <img src={SoldOverlay} className="sold-overlay-img" />
                    </div>
                  ) : (
                    ""
                  )}
                  <Carousel autoPlay>
                    {this.state.images.map((el, index) => (
                      <div
                        key={"imagegallery" + index}
                        onClick={() => {
                          if (this.state.status !== "Sold")
                            this.setState({ selectedImg: index });
                        }}
                        className="productpage__left-image-carousel-image"
                      >
                        <img src={ApiRoutes + el} />
                      </div>
                    ))}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
          <div className="productpage__right">
            <div className="productpage__right__price-container">
              <div className="productpage__right__price-row">
                <div className="productpage__right__price-row-left">
                  <div className="productpage__right__price-row-left-text">
                    {"₹ " + this.state.askingPrice}
                  </div>
                </div>
                <div className="productpage__right__price-row-right">
                  <div className="productpage__right__price-row-right-sharebtn">
                    <i className="fas fa-share-alt" />
                  </div>
                  <div className="productpage__right__price-row-right-savebtn">
                    <i className="far fa-bookmark" />
                  </div>
                </div>
              </div>
              <div className="productpage__right__price-title">
                {this.state.title}
              </div>
            </div>
            <div className="productpage__description">
              <div className="productpage__description-title">
                Product Details
              </div>
              <div className="productpage__description-desc">
                {this.state.description}
              </div>
            </div>
            <div className="productpage__right__seller">
              <div className="productpage__right__seller-title">
                Product Posted By
              </div>
              <div className="productpage__right__seller-details">
                <div className="productpage__right__seller-details-name">
                  {this.state.sellerDetails.name}
                </div>
                {this.state.status !== "Sold" && (
                  <div className="productpage__right__seller-details-address">
                    {titleCase(this.state.sellerDetails.city) +
                      ", " +
                      this.state.sellerDetails.state}
                  </div>
                )}
              </div>
              {this.state.status !== "Sold" ? (
                <div className="productpage__productpage__right__seller-details-btns">
                  {this.state.listingOwner ? (
                    <React.Fragment>
                      <button
                        className="productpage__right__seller-details-btn"
                        style={{ marginRight: "1rem" }}
                        onClick={this.toggleBoostVisibility}
                      >
                        Boost Visibility
                      </button>
                      <button
                        className="productpage__right__seller-details-btn"
                        style={{
                          marginRight: "1rem",
                          backgroundColor: "#0dec7d",
                        }}
                        onClick={this.toggleShowSoldPopup}
                      >
                        Set as Sold
                      </button>
                      <button
                        className="productpage__right__seller-details-btn"
                        style={{ backgroundColor: "#f84848" }}
                        onClick={this.toggleDeleteListing}
                      >
                        Delete Listing
                      </button>
                    </React.Fragment>
                  ) : (
                    <button
                      className="productpage__right__seller-details-btn"
                      onClick={this.startChat}
                    >
                      Contact Seller
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className="productpage__right__seller-details"
                  style={{ marginTop: "1.25rem" }}
                >
                  <div className="productpage__right__seller-title">
                    Sold To
                  </div>
                  <div className="productpage__right__seller-details-address">
                    {this.state.soldTo
                      ? this.state.soldTo.name
                      : this.state.username}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <ReactModal
          ariaHideApp={false}
          isOpen={this.state.selectedImg !== ""}
          onRequestClose={this.handleCloseModal}
          className="productpage__modal"
          overlayClassName="productpage__overlay"
        >
          <div className="productpage__modal-container">
            <Carousel selectedItem={this.state.selectedImg}>
              {this.state.images.map((el, index) => (
                <div
                  key={"imagegallerylg" + index}
                  className="productpage__zoomed-img"
                >
                  <img src={ApiRoutes + el} />
                </div>
              ))}
            </Carousel>
          </div>
        </ReactModal>
        <ReactModal
          isOpen={this.state.deleteListing}
          className="productpage__delete-modal"
          overlayClassName="productpage__delete-overlay"
        >
          <div className="productpage__delete-popup">
            <div className="productpage__delete-popup-msg">
              Are you sure you want to permanently delete this listing?
            </div>
            <div className="productpage__delete-popup-btns">
              <button
                className="productpage__delete-popup-btns-delete"
                onClick={this.deleteListing}
              >
                Delete
              </button>
              <button
                className="productpage__delete-popup-btns-cancel"
                onClick={this.toggleDeleteListing}
              >
                Cancel
              </button>
            </div>
          </div>
        </ReactModal>
        <ReactModal
          isOpen={this.state.showSoldPopup}
          onRequestClose={this.toggleShowSoldPopup}
          className="productpage__delete-modal"
          overlayClassName="productpage__delete-overlay"
        >
          <div className="productpage__sold-popup">
            <div className="productpage__sold-form">
              <div className="productpage__sold-label">
                Enter email of buyer
              </div>
              <div className="productpage__sold-row">
                <input
                  type="text"
                  value={this.state.findEmail}
                  onChange={(evt) => {
                    this.setState({ findEmail: evt.target.value });
                  }}
                  className="productpage__sold-textfield productpage__sold-row-textfield"
                />
                <button
                  className="productpage__sold-btn"
                  onClick={this.findUserByEmail}
                >
                  Search User
                </button>
              </div>
              <div className="productpage__sold-label">Buyer's Name</div>
              <input
                type="text"
                readOnly={true}
                value={this.state.username}
                className="productpage__sold-textfield"
              />
              <div className="productpage__sold-text">
                We will send an invoice to the buyer for the purchase of this
                listing.
              </div>
              <button
                className={
                  "productpage__sold-btn productpage__sold-btn-sold" +
                  (!this.state.userfound
                    ? " productpage__sold-btn-disabled"
                    : "")
                }
                onClick={!this.state.userfound ? null : this.setListingAsSold}
              >
                Confirm listing as Sold
              </button>
            </div>
          </div>
        </ReactModal>
        <ReactModal
          isOpen={this.state.showBoostVisibility}
          onRequestClose={this.toggleBoostVisibility}
          className="productpage__delete-modal"
          overlayClassName="productpage__delete-overlay"
        >
          <div className="productpage__boostvisibility-container">
            {checkIfFeatured({
              isFeatured: this.state.isFeatured,
              featuredTillDate: this.state.featuredTillDate,
            }) ? (
              <div className="productpage__boostvisibility-text">
                This listing is already featured till{" "}
                {new Date(this.state.featuredTillDate).toLocaleDateString()}
              </div>
            ) : (
              <React.Fragment>
                <div className="productpage__boostvisibility-text">
                  You can increase the chances of your listing to be sold by
                  boosting the listing using adCredits.
                  <br /> <br />
                  50 adCredits will be deducted from your balance and your
                  listing will be put in the recommended section for 7 days.
                </div>
                <div className="productpage__sold-label">Current AdCredits</div>
                <input
                  type="text"
                  readOnly={true}
                  style={{
                    color: this.props.userInfo.adCredits < 50 ? "red" : "black",
                  }}
                  value={this.props.userInfo.adCredits}
                  className="productpage__sold-textfield"
                />
                {this.props.userInfo.adCredits < 50 ? (
                  <React.Fragment>
                    <div
                      className="productpage__boostvisibility-text"
                      style={{ color: "red" }}
                    >
                      You don't have the required adCredits in your balance.
                    </div>
                    <Link
                      to="/adcredits/purchase"
                      className="productpage__boostvisibility-link"
                    >
                      Click
                    </Link>{" "}
                    to purchase more.
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    Your listing will be recommended to users till{" "}
                    {addDaysToDate(new Date(), 7).toLocaleDateString()}.
                    <button
                      className="productpage__boostvisibility-btn"
                      onClick={this.setListingAsFeatured}
                    >
                      Confirm Transaction
                    </button>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </div>
        </ReactModal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { userInfo: state.userInfo };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateProfile, start_chat }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
