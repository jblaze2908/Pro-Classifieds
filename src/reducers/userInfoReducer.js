let initialState = {
  token: "",
  _id: "",
  name: "",
  email: "",
  phone: "",
  state: "",
  city: "",
  adCredits: 0,
};
const UserInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "UPDATE_PROFILE":
      return { ...state, ...action.payload };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};
export default UserInfoReducer;
