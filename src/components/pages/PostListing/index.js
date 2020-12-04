import React, { Component } from "react";
import Select from "react-select";
import "./index.scss";
import Axios from "axios";
import ApiRoutes from "../../../config/ApiRoutes";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import { Link } from "react-router-dom";
let categoryOptions = [
  {
    label: "Fashion",
    value: "fashion",
  },
  {
    label: "Vehicle",
    value: "vehicle",
  },
  {
    label: "Furniture",
    value: "furniture",
  },
  {
    label: "Electronics",
    value: "electronics",
  },
  {
    label: "Mobiles",
    value: "mobiles",
  },
  {
    label: "Books/Sports",
    value: "books/sports",
  },
  {
    label: "Services",
    value: "services",
  },
];
let picIndex = 0;
class index extends Component {
  constructor(props) {
    super(props);
    picIndex = 0;
    this.state = {
      images: ["", "", "", "", "", ""],
      imageFiles: [],
      category: "",
      title: "",
      description: "",
      price: "",
      msg: "",
      popupBtnText: "",
      productId: "",
    };
  }
  loadPicture = () => {
    this.refs.fileUploader.click();
  };
  attachFile = (evt) => {
    let images = [...this.state.images];
    let imageFiles = [...this.state.imageFiles];
    let file = evt.target.files[0];
    if (file) {
      images[picIndex] = file;
      let url = URL.createObjectURL(file);
      imageFiles[picIndex] = url;
      picIndex += 1;
    } else {
      images[picIndex] = "";
      imageFiles[picIndex] = "url";
    }
    this.setState({ images: images, imageFiles: imageFiles });
  };
  deleteImage = (index) => {
    picIndex -= 1;
    let images = [...this.state.images];
    let imageFiles = [...this.state.imageFiles];
    images.splice(index, 1);
    imageFiles.splice(index, 1);
    images.push("");
    this.setState({ images: images, imageFiles: imageFiles });
  };
  handleFormChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  collectDataForListing = () => {
    let images = [...this.state.images];
    let img1, img2, img3, img4, img5, img6;
    img1 = images[0];
    img2 = images[1];
    img3 = images[2];
    img4 = images[3];
    img5 = images[4];
    img6 = images[5];
    let { category, title, description, price } = this.state;
    if (
      img2 === "" ||
      category === "" ||
      title === "" ||
      description === "" ||
      parseInt(price) === NaN
    )
      return;
    const data = new FormData();
    data.append("category", category);
    data.append("title", title);
    data.append("description", description);
    data.append("askingPrice", parseInt(price));
    data.append("img1", img1);
    data.append("img2", img2);
    data.append("img3", img3);
    data.append("img4", img4);
    data.append("img5", img5);
    data.append("img6", img6);
    this.uploadListing(data);
  };

  uploadListing = (data) => {
    Axios.post(ApiRoutes + "listing/add_listing", data, {
      headers: {
        authorization: this.props.userInfo.token,
      },
    })
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          this.setState({
            msg: "Your listing has been added successfully.",
            popupBtnText: "View Listing",
            productId: res.data.productId,
          });
        }
      })
      .catch((e) => {});
  };
  popupBtnClickAction = () => {
    if (this.state.msg === "Your listing has been added successfully.") {
      this.props.history.push("/product/" + this.state.productId);
    } else this.setState({ msg: "" });
  };
  render() {
    return (
      <div className="postlisting__container">
        <div className="postlisting__header">Post Your Listing</div>
        <div className="postlisting__form">
          <div className="postlisting__form-label">Choose a Category</div>
          <Select
            options={categoryOptions}
            onChange={(e) => {
              this.setState({ category: e.value });
            }}
          />
          <div className="postlisting__form-label">Add a Title</div>
          <input
            type="text"
            onChange={this.handleFormChange}
            name="title"
            className="postlisting__form-textfield"
          />
          <div className="postlisting__form-label">Add a Description</div>
          <textarea
            onChange={this.handleFormChange}
            name="description"
            className="postlisting__form-textarea"
          ></textarea>
          <div className="postlisting__form-label">Set a Price</div>
          <div className="postlisting__form-price-container">
            <div className="postlisting__form-price-rupee">₹</div>
            <div className="postlisting__form-price-text">
              <input
                type="text"
                onKeyPress={(evt) => {
                  if (!evt.key.match(/^-{0,1}\d+$/)) evt.preventDefault();
                }}
                onChange={this.handleFormChange}
                name="price"
                className="postlisting__form-textfield"
              />
            </div>
          </div>
          <div className="postlisting__form-label">
            Upload some Photos (Minimum 2)
          </div>
          <div className="postlisting__form-images">
            {this.state.images.map((el, i) => {
              if (el === "")
                return (
                  <div
                    className="postlisting__form-image"
                    style={{ cursor: "pointer" }}
                    onClick={this.loadPicture}
                    key={"image" + i}
                  >
                    <span>Upload Pic</span>
                  </div>
                );
              else
                return (
                  <div
                    className="postlisting__form-image"
                    style={{ cursor: "pointer" }}
                    key={"image" + i}
                  >
                    <div
                      className="postlisting__form-image-overlay"
                      onClick={() => {
                        this.deleteImage(i);
                      }}
                    >
                      Click to delete image.
                    </div>
                    <img
                      src={this.state.imageFiles[i]}
                      style={{ height: "100%", width: "100%" }}
                    />
                  </div>
                );
            })}
          </div>

          <button
            className="postlisting__form-btn"
            onClick={this.collectDataForListing}
          >
            Post Listing
          </button>
          <input
            type="file"
            accept=".jpg,.png,.jpeg"
            name=""
            ref="fileUploader"
            onChange={this.attachFile}
            id=""
            style={{ display: "none" }}
          />
        </div>
        <ReactModal
          ariaHideApp={false}
          isOpen={this.state.msg !== ""}
          className="postlisting__form-popup-modal"
          overlayClassName="postlisting__form-popup-overlay"
        >
          <div className="postlisting__form-popup-container">
            <div className="postlisting__form-popup-msg">{this.state.msg}</div>
            <button
              className="postlisting__form-popup-btn"
              onClick={this.popupBtnClickAction}
            >
              {this.state.popupBtnText}
            </button>
          </div>
        </ReactModal>
        <ReactModal
          ariaHideApp={false}
          isOpen={this.props.userInfo.state === ""}
          className="postlisting__form-popup-modal"
          overlayClassName="postlisting__form-popup-overlay"
        >
          <div className="postlisting__form-popup-container">
            <div className="postlisting__form-popup-msg">
              First complete your profile setup.
            </div>
            <Link to="/profile" className="postlisting__form-popup-btn-link">
              Continue
            </Link>
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
