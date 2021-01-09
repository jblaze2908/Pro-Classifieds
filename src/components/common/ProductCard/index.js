import React from "react";
import "./index.scss";
import SoldOverlay from "../../../assets/images/sold.png";
import Moment from "react-moment";
import { Link } from "react-router-dom";
export default function ProductCard(props) {
  const {
    id,
    image,
    price,
    title,
    desc,
    address,
    date_added,
    status,
    featured,
  } = props;
  return (
    <Link
      to={"/product/" + (id || "randomID")}
      className="productcard__container"
    >
      {featured && (
        <div className="ribbon ribbon-top-left">
          <span>Featured</span>
        </div>
      )}
      {status === "Sold" && (
        <div className="productcard__overlay-container">
          <img src={SoldOverlay} className="productcard__overlay" />
        </div>
      )}
      <div className="productcard__image">
        <img src={image} alt="" />
      </div>
      <div className="productcard__details">
        <div className="productcard__details-price">₹{price}</div>
        <div className="productcard__details-title">{title}</div>
        <div className="productcard__details-desc">{desc}</div>
      </div>
      <div className="productcard__footer">
        <div className="productcard__footer-address">{address}</div>
        <div className="productcard__footer-date">
          <Moment format="DD MMM">{date_added}</Moment>
        </div>
      </div>
    </Link>
  );
}
