import { combineReducers } from "redux";
import UserInfoReducer from "./userInfoReducer";
const allReducers = combineReducers({
  userInfo: UserInfoReducer,
});
const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") state = undefined;
  return allReducers(state, action);
};
export default rootReducer;
