import { callExternalApi } from "./external-api.service";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export const getPublicResource = async () => {
  const config = {
    url: `${apiServerUrl}/api/messages/public`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data: data || null,
    error,
  };
};

const withBearerToken = async (getAccessToken, config) => {
  let accessToken;
  try {
    accessToken = await getAccessToken();
  } catch (error) {
    return {
      data: null,
      error: {
        message: error?.message || String(error),
        error: error?.error,
      },
    };
  }

  return callExternalApi({
    config: {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};

/** @param {() => Promise<string>} getAccessToken from useApiAccessToken() */
export const getProtectedResource = async (getAccessToken) => {
  const { data, error } = await withBearerToken(getAccessToken, {
    url: `${apiServerUrl}/api/messages/protected`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });

  return {
    data: data || null,
    error,
  };
};

/** @param {() => Promise<string>} getAccessToken from useApiAccessToken() */
export const getAdminResource = async (getAccessToken) => {
  const { data, error } = await withBearerToken(getAccessToken, {
    url: `${apiServerUrl}/api/messages/admin`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });

  return {
    data: data || null,
    error,
  };
};
