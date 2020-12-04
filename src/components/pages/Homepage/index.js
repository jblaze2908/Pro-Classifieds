import Axios from "axios";
import React, { Component } from "react";
import ApiRoutes from "../../../config/ApiRoutes";
import ProductCard from "../../common/ProductCard";
import { titleCase } from "../../../utlities/preDefinedFunctions";
import "./index.scss";
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listingsFeatured: [],
      listings: [],
    };
  }
  fetchAllListings = () => {
    Axios.get(ApiRoutes + "listing/fetch_all_listing").then((res) => {
      console.log(res.data);
      let listings = res.data.filter((el) => !el.isFeatured);
      let listingsFeatured = res.data.filter((el) => el.isFeatured);
      this.setState({
        listingsFeatured,
        listings,
      });
    });
  };
  componentDidMount() {
    this.fetchAllListings();
  }
  render() {
    return (
      <div>
        <div className="homepage__products-recommended">
          <div className="homepage__products-recommended-title">
            Recommended Listings
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
