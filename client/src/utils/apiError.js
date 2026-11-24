// Pull a readable message out of an axios error.
export const getErrorMessage = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

export const authHeader = (auth) => ({
  headers: { Authorization: auth?.token || "" },
});
