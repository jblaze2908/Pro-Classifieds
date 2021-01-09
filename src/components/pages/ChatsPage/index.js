import React, { Component } from "react";
import "./index.scss";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Axios from "axios";
import ApiRoutes from "../../../config/ApiRoutes";
import { start_chat } from "../../../actions/chats";
const SentMessage = (props) => {
  let { message, time } = props;
  return (
    <div className="chatbox__right-messages-sent-container">
      {" "}
      <div className="chatbox__right-messages-sent">{message}</div>{" "}
      <div className="chatbox__right-messages-sent-time">
        {" "}
        {new Date(time).toLocaleDateString() +
          " " +
          new Date(time).toLocaleTimeString()}{" "}
      </div>{" "}
    </div>
  );
};
const RecievedMessage = (props) => {
  let { message, time } = props;
  return (
    <div className="chatbox__right-messages-received-container">
      {" "}
      <div className="chatbox__right-messages-received">{message}</div>{" "}
      <div className="chatbox__right-messages-received-time">
        {" "}
        {new Date(time).toLocaleDateString() +
          " " +
          new Date(time).toLocaleTimeString()}{" "}
      </div>{" "}
    </div>
  );
};
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: "",
      message: "",
      thread_id: "",
      existingChat: false,
      threadMessages: [],
      buyingChatThreads: [],
      sellingChatThreads: [],
    };
  }
  componentDidMount = () => {
    this.loadData();
  };
  autoResize = (evt) => {
    var el = evt.target;
    setTimeout(function () {
      if (el.style.cssText === "height:10rem") return;
      el.style.cssText = "height:auto; padding:0";
      el.style.cssText = "height:" + el.scrollHeight + "px";
    }, 0);
  };
  loadData = async () => {
    let token = this.props.userInfo.token || sessionStorage.getItem("token");
    let product_id = this.props.match.params.product_id;
    let threads = await this.fetchChatThreads(token);
    let pos;
    pos = threads
      .map((e) => {
        return e.product_id._id;
      })
      .indexOf(product_id);
    if (pos !== -1) {
      let thread = threads[pos];
      if (this.props.chat.chattingWith._id === "") {
        let data = {
          _id: thread.chatThreadSeller._id,
          name: thread.chatThreadSeller.name,
          product_id: thread.product_id._id,
          productName: thread.product_id.title,
        };
        this.props.start_chat(data);
      }
      let threadDetails = await this.fetchChatThreadDetails(thread._id, token);
      let sortedChatThreads = await this.sortChatThreads(
        threads,
        this.props.userInfo._id
      );
      this.setState({
        thread_id: thread._id,
        threadMessages: threadDetails.threadMessages,
        existingChat: true,
        buyingChatThreads: sortedChatThreads.buyingChatThreads,
        sellingChatThreads: sortedChatThreads.sellingChatThreads,
      });
    } else {
      if (this.props.chat.chattingWith._id === "") {
        let productDetails = await this.fetchProductListingDetails(
          product_id,
          token
        );
        let data = {
          _id: productDetails.sellerId._id,
          name: productDetails.sellerId.name,
          product_id: productDetails._id,
          productName: productDetails.title,
        };
        this.props.start_chat(data);
        let sortedChatThreads = await this.sortChatThreads(
          threads,
          this.props.userInfo._id
        );

        this.setState({
          buyingChatThreads: sortedChatThreads.buyingChatThreads,
          sellingChatThreads: sortedChatThreads.sellingChatThreads,
        });
      }
    }
  };
  sortChatThreads = (chatThreads, user_id) => {
    return new Promise(async (resolve, reject) => {
      let buyingChatThreads = chatThreads.filter(
        (el) => el.chatThreadBuyer._id === user_id
      );
      let sellingChatThreads = chatThreads.filter(
        (el) => el.chatThreadSeller._id === user_id
      );
      resolve({ buyingChatThreads, sellingChatThreads });
    });
  };
  fetchProductListingDetails = (product_id, token) => {
    return new Promise(async (resolve, reject) => {
      Axios.get(
        ApiRoutes + "listing/fetch_listing_details_by_id/" + product_id,
        { headers: { authorization: token } }
      ).then((res) => {
        resolve(res.data);
      });
    });
  };
  fetchChatThreads = (token) => {
    return new Promise(async (resolve, reject) => {
      Axios.get(ApiRoutes + "chat/fetch_user_chat_threads", {
        headers: { authorization: token },
      }).then((res) => {
        resolve(res.data.chatThreads);
      });
    });
  };
  fetchChatThreadDetails = (chat_id, token) => {
    return new Promise(async (resolve, reject) => {
      Axios.get(ApiRoutes + "chat/fetch_specific_chat_thread/" + chat_id, {
        headers: { authorization: token },
      }).then((res) => {
        resolve(res.data);
      });
    });
  };
  sendMessage = () => {
    let { message, existingChat, thread_id } = this.state;
    if (message === "") return;
    if (!existingChat) this.createChatThread(message);
    else this.replyToThread(message, thread_id);
  };
  createChatThread = (message) => {
    Axios.post(
      ApiRoutes + "chat/create_chat_thread",
      { product_id: this.props.chat.chattingWith.product_id, message },
      { headers: { authorization: this.props.userInfo.token } }
    ).then((res) => {
      if (res.status === 200) {
        this.setState({
          existingChat: true,
          threadMessages: [res.data.firstChatMessage],
          thread_id: res.data.thread_id,
          message: "",
        });
      }
    });
  };
  replyToThread = (message, thread_id) => {
    Axios.post(
      ApiRoutes + "chat/reply_to_thread",
      { thread_id, message },
      { headers: { authorization: this.props.userInfo.token } }
    ).then((res) => {
      if (res.status === 200) {
        let threadMessages = [...this.state.threadMessages];
        threadMessages.push(res.data.reply);
        this.setState({ threadMessages: [...threadMessages], message: "" });
      }
    });
  };
  changeChatThread = async (thread, isSelling) => {
    let threadDetails = await this.fetchChatThreadDetails(
      thread._id,
      this.props.userInfo.token || sessionStorage.getItem("token")
    );
    let data = {
      _id: !isSelling
        ? thread.chatThreadBuyer._id
        : thread.chatThreadSeller._id,
      name: !isSelling
        ? thread.chatThreadBuyer.name
        : thread.chatThreadSeller.name,
      product_id: thread.product_id._id,
      productName: thread.product_id.title,
    };
    this.props.start_chat(data);
    this.setState({
      thread_id: thread._id,
      threadMessages: threadDetails.threadMessages,
      existingChat: true,
    });
  };
  handleTextAreaChange = (e) => {
    this.setState({ message: e.target.value });
  };
  render() {
    return (
      <div className="chatbox__container">
        {" "}
        <div className="chatbox__left">
          {" "}
          <div className="chatbox__left-lists">
            {" "}
            <div
              className={
                "chatbox__left-lists-list chatbox__left-lists-list-buying" +
                (this.state.showing === "buying"
                  ? " chatbox__left-lists-list-open"
                  : "")
              }
            >
              {" "}
              <div
                className="chatbox__left-lists-list-name"
                onClick={() => {
                  let changeTo = "";
                  if (this.state.showing !== "buying") changeTo = "buying";
                  this.setState({ showing: changeTo });
                }}
              >
                {" "}
                <div className="chatbox__left-lists-list-name-text">
                  Buying
                </div>{" "}
                <div
                  className={
                    "chatbox__left-lists-list-name-icon" +
                    (this.state.showing === "buying" ? " invert" : "")
                  }
                >
                  {" "}
                  <i className="fas fa-angle-down" />{" "}
                </div>{" "}
              </div>{" "}
              <div className="chatbox__left-lists-list-content">
                {" "}
                {this.state.buyingChatThreads.map((el) => (
                  <div
                    className="chatbox__left-lists-list-content-chat"
                    onClick={() => {
                      this.changeChatThread(el, true);
                    }}
                  >
                    {" "}
                    {el.product_id.title}{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>{" "}
            <div
              className={
                "chatbox__left-lists-list chatbox__left-lists-list-selling" +
                (this.state.showing === "selling"
                  ? " chatbox__left-lists-list-open"
                  : "")
              }
            >
              {" "}
              <div
                className="chatbox__left-lists-list-name"
                onClick={() => {
                  let changeTo = "";
                  if (this.state.showing !== "selling") changeTo = "selling";
                  this.setState({ showing: changeTo });
                }}
              >
                {" "}
                <div className="chatbox__left-lists-list-name-text">
                  {" "}
                  Selling{" "}
                </div>{" "}
                <div
                  className={
                    "chatbox__left-lists-list-name-icon" +
                    (this.state.showing === "selling" ? " invert" : "")
                  }
                >
                  {" "}
                  <i className="fas fa-angle-down" />{" "}
                </div>{" "}
              </div>{" "}
              <div className="chatbox__left-lists-list-content">
                {" "}
                {this.state.sellingChatThreads.map((el) => (
                  <div
                    className="chatbox__left-lists-list-content-chat"
                    onClick={() => {
                      this.changeChatThread(el, false);
                    }}
                  >
                    {" "}
                    {el.product_id.title}{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="chatbox__right">
          {" "}
          <div className="chatbox__right-chatheader">
            {" "}
            <div className="chatbox__right-chatheader-name">
              {" "}
              {this.props.chat.chattingWith.name} ({" "}
              {this.props.chat.chattingWith.productName}){" "}
            </div>{" "}
          </div>{" "}
          <div className="chatbox__right-messages-container">
            {" "}
            {this.state.threadMessages.map((message, index) => {
              if (message.sentBy === this.props.userInfo._id)
                return (
                  <SentMessage
                    message={message.messageContent}
                    time={message.sentAt}
                  />
                );
              else
                return (
                  <RecievedMessage
                    message={message.messageContent}
                    time={message.sentAt}
                  />
                );
            })}{" "}
          </div>{" "}
          <div className="chatbox__right-chatfooter">
            {" "}
            <div className="chatbox__right-chatfooter-textarea-container">
              {" "}
              <textarea
                className="chatbox__right-chatfooter-textarea"
                placeholder="Type Something..."
                rows={1}
                value={this.state.message}
                onChange={this.handleTextAreaChange}
                onKeyDown={this.autoResize}
              />{" "}
            </div>{" "}
            <div className="chatbox__right-chatfooter-sendicon">
              {" "}
              <i
                className="fab fa-telegram-plane"
                onClick={this.sendMessage}
              />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { userInfo: state.userInfo, chat: state.chat };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ start_chat }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
