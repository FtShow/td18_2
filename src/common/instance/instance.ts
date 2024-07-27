import axios from "axios";

export const settings = {
  withCredentials: true,
  headers: {
    "API-KEY": "9075fb11-bbe8-406e-883a-30df5808daaa",
  },
};
export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  ...settings,
});