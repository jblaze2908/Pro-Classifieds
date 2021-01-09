let initialState = {
  chattingWith: { _id: "", name: "", product_id: "", productName: "" },
};
const chatsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "START_CHAT":
      return { ...state, chattingWith: { ...action.payload } };
    default:
      return state;
  }
};
export default chatsReducer;
