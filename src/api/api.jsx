import { API_COLOR_URL } from "./consts";

export const fetchColors = async (name) => {
  try {
    const options = name
      ? {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ name }),
        }
      : {};

    const response = await fetch(API_COLOR_URL, options);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
