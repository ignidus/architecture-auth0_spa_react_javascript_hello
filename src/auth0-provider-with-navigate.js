import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const useRefreshTokens =
  process.env.REACT_APP_AUTH0_USE_REFRESH_TOKENS === "true";
const useRefreshTokensFallback =
  process.env.REACT_APP_AUTH0_USE_REFRESH_TOKENS_FALLBACK === "true";
const cacheLocation =
  process.env.REACT_APP_AUTH0_CACHE_LOCATION === "localstorage"
    ? "localstorage"
    : "memory";

export const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL;
  const organizationId = process.env.REACT_APP_AUTH0_ORG_ID;

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  if (!(domain && clientId && redirectUri)) {
    return null;
  }

  const audience = process.env.REACT_APP_AUTH0_API_AUDIENCE_URL;

  const authorizationParams = {
    redirect_uri: redirectUri,
    organization: organizationId,
    ...(audience ? { audience } : {}),
    ...(useRefreshTokens
      ? { scope: "openid profile email offline_access" }
      : {}),
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={authorizationParams}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={useRefreshTokens}
      useRefreshTokensFallback={useRefreshTokensFallback}
      cacheLocation={cacheLocation}
    >
      {children}
    </Auth0Provider>
  );
};
