const login = (data) => {
  return { type: "LOGIN", payload: data };
};
const updateProfile = (data) => {
  return { type: "UPDATE_PROFILE", payload: data };
};
const logout = () => {
  sessionStorage.clear();
  return { type: "LOGOUT" };
};
export { login, updateProfile, logout };
