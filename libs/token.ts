export const getAuthData = () => {
  const info = globalThis.localStorage.getItem("info");

  return info ? JSON.parse(info) : null;
};

export const setAuthData = (data: object) => {
  if (data) {
    globalThis.localStorage.setItem("info", JSON.stringify(data));
  }
};

export const removeAuthData = () => {
  globalThis.localStorage.removeItem("info");
};
