import { combineReducers } from "redux";
import UserInfoReducer from "./userInfoReducer";
import HomepageDisplayReducer from "./homepageDisplayReducer";
import ChatsReducer from "./chatsReducer";
const allReducers = combineReducers({
  userInfo: UserInfoReducer,
  homepage: HomepageDisplayReducer,
  chat: ChatsReducer,
});
const rootReducer = (state, action) => {
  if (action.type === "LOGOUT")
    state = state = { undefined, homepage: state.homepage };
  return allReducers(state, action);
};
export default rootReducer;
