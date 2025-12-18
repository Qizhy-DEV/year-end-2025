import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "super-secret-key";
const JWT_EXPIRES_IN = "1h";

export const getAuthToken = () => {
  const info = localStorage.getItem("info");

  return info ?? null;
};

export const setAuthToken = (data: string) => {
  if (data) {
    localStorage.setItem("info", data);
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem("info");
};

export const signToken = (payload: object) => {
  console.log(JWT_SECRET);
  if (typeof window !== "undefined") {
    return btoa(JSON.stringify(payload));
  }
  return (require("jsonwebtoken") as typeof jwt).sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};
