import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./index.scss";
import Axios from "axios";
import ApiRoutes from "../../../config/ApiRoutes";
import RazorpayKey from "../../../config/RazorpayKey";
import ReactModal from "react-modal";
import { Link } from "react-router-dom";
import { updateProfile } from "../../../actions/userInfo";
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProduct: 0,
      paymentSuccess: false,
      paymentFailed: false,
    };
  }
  calcFinalAdCredits = (initial) => {
    let { selectedProduct } = this.state;
    switch (selectedProduct) {
      case 1:
        return initial + 250;
      case 2:
        return initial + 550;
      case 3:
        return initial + 1000;
    }
  };
  initiatePurchase = () => {
    if (this.state.selectedProduct === 0) return;
    let { selectedProduct } = this.state;
    let amt;
    switch (selectedProduct) {
      case 1:
        amt = 250;
        break;
      case 2:
        amt = 500;
        break;
      case 3:
        amt = 900;
    }
    Axios.post(
      ApiRoutes + "payment/rzp/create_order",
      { amount: amt },
      { headers: { authorization: this.props.userInfo.token } }
    ).then((res) => {
      const options = {
        key: RazorpayKey,
        amount: amt * 100,
        currency: "INR",
        name: "",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: res.data.order_id,
        handler: this.handlePaymentSuccess,
        prefill: {
          name: this.props.userInfo.name,
          email: this.props.userInfo.email,
          contact: this.props.userInfo.phone,
        },
        theme: { color: "#598bff" },
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();
    });
  };
  handlePaymentSuccess = (response) => {
    Axios.post(ApiRoutes + "payment/rzp/verify_signature", response, {
      headers: { authorization: this.props.userInfo.token },
    }).then((res) => {
      if (res.status === 200) {
        this.setState({ paymentSuccess: true });
        this.props.updateProfile({ adCredits: res.data.adCredits });
      }
    });
  };
  handlePaymentFailure = (response) => {};
  render() {
    return (
      <div className="purchasepage__container">
        <div className="purchasepage__header">Purchase AdCredits</div>
        <div className="purchasepage__subheader"></div>
        <div className="purchasepage__form">
          <div className="purchasepage__form-label">
            Current No. of AdCredits
          </div>
          <input
            type="text"
            className="purchasepage__form-textfield"
            readOnly={true}
            value={this.props.userInfo.adCredits}
          />
          <div className="purchasepage__form-prices">
            <div
              className={
                "purchasepage__form-prices-box" +
                (this.state.selectedProduct === 1
                  ? " purchasepage__form-prices-box-active"
                  : "")
              }
              onClick={() => {
                this.setState({ selectedProduct: 1 });
              }}
            >
              <div className="purchasepage__form-prices-box-icon">
                <i className="fab fa-adn" />
              </div>
              <div className="purchasepage__form-prices-box-product">
                250 AdCredits
              </div>
              <div className="purchasepage__form-prices-box-price">Rs. 250</div>
            </div>
            <div
              className={
                "purchasepage__form-prices-box" +
                (this.state.selectedProduct === 2
                  ? " purchasepage__form-prices-box-active"
                  : "")
              }
              onClick={() => {
                this.setState({ selectedProduct: 2 });
              }}
            >
              <div className="purchasepage__form-prices-box-icon">
                <i className="fab fa-adn" />
              </div>
              <div className="purchasepage__form-prices-box-product">
                550 AdCredits
              </div>
              <div className="purchasepage__form-prices-box-oldprice">
                Rs. 550
              </div>
              <div className="purchasepage__form-prices-box-price">Rs. 500</div>
            </div>
            <div
              className={
                "purchasepage__form-prices-box" +
                (this.state.selectedProduct === 3
                  ? " purchasepage__form-prices-box-active"
                  : "")
              }
              onClick={() => {
                this.setState({ selectedProduct: 3 });
              }}
            >
              <div className="purchasepage__form-prices-box-icon">
                <i className="fab fa-adn" />
              </div>
              <div className="purchasepage__form-prices-box-product">
                1000 AdCredits
              </div>
              <div className="purchasepage__form-prices-box-oldprice">
                Rs. 1000
              </div>
              <div className="purchasepage__form-prices-box-price">Rs. 900</div>
            </div>
          </div>
          <div
            className="purchasepage__form-label"
            style={{ marginTop: "2rem" }}
          >
            No. of AdCredits You Will Have
          </div>
          <input
            type="text"
            className="purchasepage__form-textfield"
            readOnly={true}
            value={this.calcFinalAdCredits(this.props.userInfo.adCredits) || ""}
          />
          <button
            className={
              "purchasepage__form-btn" +
              (this.state.selectedProduct === 0
                ? " purchasepage__form-btn-disabled"
                : "")
            }
            onClick={this.initiatePurchase}
          >
            Continue with Purchase
          </button>
        </div>
        <ReactModal
          isOpen={this.state.paymentSuccess}
          className="purchasepage__popup-modal"
          overlayClassName="purchasepage__popup-overlay"
        >
          <div className="purchasepage__popup-container">
            <div className="purchasepage__popup-msg">
              Your payment has been confirmed.
              <br />
              Your AdCredits have been added to your account.
            </div>
            <Link to="/profile" className="purchasepage__popup-link">
              Go to Profile
            </Link>
          </div>
        </ReactModal>
        <ReactModal
          isOpen={this.state.paymentFailed}
          className="purchasepage__popup-modal"
          overlayClassName="purchasepage__popup-overlay"
        >
          <div className="purchasepage__popup-container">
            <div className="purchasepage__popup-msg">
              There was a problem with your transaction.
            </div>
            <Link to="/" className="purchasepage__popup-link">
              Go to Homepage
            </Link>
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
  return bindActionCreators({ updateProfile }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
