export const getAuthData = () => {
  if (typeof window === "undefined") return null;

  const info = window.localStorage.getItem("info");
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
