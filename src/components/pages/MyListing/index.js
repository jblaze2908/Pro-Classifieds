import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ProductCard from "../../common/ProductCard";
import Axios from "axios";
import { titleCase } from "../../../utlities/preDefinedFunctions";
import ApiRoutes from "../../../config/ApiRoutes";
import "./index.scss";
class index extends Component {
  constructor(props) {
    super(props);
    this.state = { listings: [] };
  }
  componentDidMount() {
    Axios.get(ApiRoutes + "listing/view_user_listing", {
      headers: {
        authorization:
          this.props.userInfo.token || sessionStorage.getItem("token"),
      },
    }).then((res) => {
      this.setState({ listings: res.data });
    });
  }
  render() {
    return (
      <div className="mylisting__container">
        <div className="mylisting__header">My Product Listings</div>
        <div className="mylisting__listings">
          {this.state.listings.map((el, index) => (
            <ProductCard
              id={el.productId}
              image={ApiRoutes + el.images[0]}
              price={el.askingPrice}
              title={el.title}
              desc={el.description}
              address={
                titleCase(this.props.userInfo.city) +
                ", " +
                this.props.userInfo.state
              }
              date_added={new Date(el.createdAt)}
              status={el.status}
            />
          ))}
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
  return bindActionCreators({}, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
