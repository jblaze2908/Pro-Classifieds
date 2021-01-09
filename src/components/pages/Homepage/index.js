import Axios from "axios";
import React, { Component } from "react";
import ApiRoutes from "../../../config/ApiRoutes";
import ProductCard from "../../common/ProductCard";
import {
  titleCase,
  checkIfFeatured,
} from "../../../utlities/preDefinedFunctions";
import "./index.scss";
import { connect } from "react-redux";
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listingsFeatured: [],
      listings: [],
      listingsAll: [],
      listingsFeaturedAll: [],
    };
  }
  fetchAllListings = () => {
    Axios.get(ApiRoutes + "listing/fetch_all_listing").then((res) => {
      let listings = res.data;
      let listingsFeatured = [];
      listingsFeatured = listings.filter((el) => checkIfFeatured(el));
      this.setState({
        listingsFeatured,
        listingsFeaturedAll: listingsFeatured,
        listings,
        listingsAll: listings,
      });
    });
  };
  filterAccordingToCategory = (category) => {
    let { listingsAll, listingsFeaturedAll } = this.state;
    if (category === "all") {
      this.setState({
        listings: [...listingsAll],
        listingsFeatured: [...listingsFeaturedAll],
      });
    } else {
      let listingsFeaturedFiltered = listingsFeaturedAll.filter(
        (el) => el.category === category
      );
      let listingsFiltered = listingsAll.filter(
        (el) => el.category === category
      );
      this.setState({
        listings: [...listingsFiltered],
        listingsFeatured: [...listingsFeaturedFiltered],
      });
    }
  };
  componentDidUpdate(prevProps) {
    if (prevProps.homepage.category !== this.props.homepage.category) {
      this.filterAccordingToCategory(this.props.homepage.category);
    }
  }
  componentDidMount() {
    this.fetchAllListings();
  }
  render() {
    return (
      <div>
        <div className="homepage__products-recommended">
          <div
            className="homepage__products-grid"
            style={{ justifyContent: "center" }}
          >
            {this.state.listingsFeatured.map((el, index) => (
              <ProductCard
                id={el.productId}
                featured={true}
                image={ApiRoutes + el.images[0]}
                price={el.askingPrice}
                title={el.title}
                desc={el.description}
                address={titleCase(el.sellerId.city) + ", " + el.sellerId.state}
                date_added={new Date(el.createdAt)}
              />
            ))}
          </div>
          <div className="homepage__products-grid">
            {this.state.listings.map((el, index) => (
              <ProductCard
                id={el.productId}
                image={ApiRoutes + el.images[0]}
                price={el.askingPrice}
                title={el.title}
                desc={el.description}
                address={titleCase(el.sellerId.city) + ", " + el.sellerId.state}
                date_added={new Date(el.createdAt)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { homepage: state.homepage };
};
export default connect(mapStateToProps)(index);
