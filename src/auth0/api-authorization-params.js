const ORG_ID = process.env.REACT_APP_AUTH0_ORG_ID;
const AUDIENCE = process.env.REACT_APP_AUTH0_API_AUDIENCE_URL;

/** Passed to getAccessTokenSilently for API (audience) access tokens. */
export const apiAuthorizationParams = {
  audience: AUDIENCE,
  ...(ORG_ID ? { organization: ORG_ID } : {}),
};
