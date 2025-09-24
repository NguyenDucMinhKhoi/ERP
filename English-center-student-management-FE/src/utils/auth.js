export const ACCESS_TOKEN_KEY = "ecsm_access_token";
export const REFRESH_TOKEN_KEY = "ecsm_refresh_token";

export function getAccessToken() {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

export function getRefreshToken() {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem(REFRESH_TOKEN_KEY)
  );
}