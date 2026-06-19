import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import { apiAuthorizationParams } from "../auth0/api-authorization-params";

/**
 * Returns a function that fetches an API access token for this SPA only
 * (client ID + audience from .env). Tokens are not shared across ISC apps.
 *
 * With REACT_APP_AUTH0_USE_REFRESH_TOKENS=true, the SDK stores a refresh
 * token in this origin’s localStorage and renews via /oauth/token (Safari-safe).
 */
export const useApiAccessToken = () => {
  const { getAccessTokenSilently } = useAuth0();

  return useCallback(
    () =>
      getAccessTokenSilently({
        authorizationParams: apiAuthorizationParams,
      }),
    [getAccessTokenSilently]
  );
};
