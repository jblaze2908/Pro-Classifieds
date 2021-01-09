let initialState = { category: "All" };
const homepageDisplayReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_CATEGORY":
      return { category: action.payload };
    default:
      return state;
  }
};
export default homepageDisplayReducer;
