import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.scss";
import { login } from "./actions/userInfo";
import Navbar from "./components/common/Navbar";
import Homepage from "./components/pages/Homepage";
import ProductPage from "./components/pages/ProductPage";
import ProfilePage from "./components/pages/ProfilePage";
import PostListing from "./components/pages/PostListing";
import MyListing from "./components/pages/MyListing";
import PurchaseAdCredits from "./components/pages/PurchaseAdCredits";
import ChatsPage from "./components/pages/ChatsPage";
import Axios from "axios";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ApiRoutes from "./config/ApiRoutes";
class ProtectedRoute extends Component {
  render() {
    const { component: Component, ...props } = this.props;
    return (
      <Route
        {...props}
        render={(props) =>
          sessionStorage.getItem("token") ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
    );
  }
}

class App extends Component {
  fetchUserInfo = (token) => {
    Axios.get(ApiRoutes + "user/fetch_profile", {
      headers: {
        authorization: token,
      },
    }).then((res) => {
      this.props.login({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        token: token,
        state: res.data.state || "",
        city: res.data.city || "",
        adCredits: res.data.adCredits,
      });
    });
  };
  componentDidMount() {
    let token = sessionStorage.getItem("token");
    if (token) {
      this.fetchUserInfo(token);
    }
  }
  render() {
    return (
      <div className="pagebg">
        <Navbar />
        <Switch>
          <Route exact path="/" component={Homepage} />
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <ProtectedRoute path="/my_listings" component={MyListing} />
          <ProtectedRoute path="/product/add_new" component={PostListing} />
          <ProtectedRoute path="/chats/:product_id" component={ChatsPage} />
          <Route path="/product/:id" component={ProductPage} />
          <ProtectedRoute
            path="/adcredits/purchase"
            component={PurchaseAdCredits}
          />
        </Switch>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { token: state.userInfo.token };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      login,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
