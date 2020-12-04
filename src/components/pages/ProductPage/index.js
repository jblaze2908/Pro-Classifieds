import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import ReactModal from "react-modal";
import "./index.scss";
import Axios from "axios";
import ApiRoutes from "../../../config/ApiRoutes";
import { titleCase } from "../../../utlities/preDefinedFunctions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImg: "",
      images: [],
      askingPrice: "",
      createdAt: "",
      description: "",
      sellerDetails: { _id: "", name: "", state: "", city: "" },
      title: "",
      status: "",
      listingOwner: false,
      deleteListing: false,
    };
  }
  handleCloseModal = () => {
    this.setState({ selectedImg: "" });
  };
  loadListingData = (productId) => {
    Axios.get(ApiRoutes + "listing/fetch_listing_detail/" + productId).then(
      (res) => {
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
            description: data.description,
            sellerDetails: data.sellerId,
            title: data.title,
            status: data.status,
            listingOwner,
          });
        }
      }
    );
  };
  toggleDeleteListing = () => {
    this.setState({ deleteListing: !this.state.deleteListing });
  };
  deleteListing = () => {
    Axios.post(
      ApiRoutes + "listing/delete_listing",
      {
        productId: this.props.match.params.id,
      },
      {
        headers: {
          authorization: this.props.userInfo.token,
        },
      }
    ).then((res) => {
      console.log(res);
      if (res.status === 200) {
        this.props.history.push("/");
      }
    });
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
                  <Carousel autoPlay>
                    {this.state.images.map((el, index) => (
                      <div
                        key={"imagegallery" + index}
                        onClick={() => {
                          this.setState({ selectedImg: index });
                        }}
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
                <div className="productpage__right__seller-details-address">
                  {titleCase(this.state.sellerDetails.city) +
                    ", " +
                    this.state.sellerDetails.state}
                </div>
              </div>
              <div className="productpage__productpage__right__seller-details-btns">
                {this.state.listingOwner ? (
                  <React.Fragment>
                    <button
                      className="productpage__right__seller-details-btn"
                      style={{
                        marginRight: "1rem",
                        backgroundColor: "#0dec7d",
                      }}
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
                  <button className="productpage__right__seller-details-btn">
                    Contact Seller
                  </button>
                )}
              </div>
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
                <div key={"imagegallerylg" + index}>
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
export default connect(mapStateToProps, mapDispatchToProps)(index);
