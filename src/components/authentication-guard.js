import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import React, { useEffect, useMemo, useState } from "react";
import { apiAuthorizationParams } from "../auth0/api-authorization-params";
import { PageLoader } from "./page-loader";
import { isInIframe } from "../utils/iframe";

const redirectingLoader = () => (
  <div className="page-layout">
    <PageLoader />
  </div>
);

/**
 * Auth0 New Universal Login cannot render inside an iframe (X-Frame-Options).
 * loginWithRedirect in a frame triggers the "Application Login URI" error.
 * Embedded login uses loginWithPopup: UI stays in the host page, Auth0 opens in a popup.
 */
const IframeAuthenticationGuard = ({ component: Component }) => {
  const { isAuthenticated, isLoading, loginWithPopup, error } = useAuth0();
  const [signingIn, setSigningIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleLogin = async () => {
    setSigningIn(true);
    setLoginError(null);
    try {
      await loginWithPopup({
        authorizationParams: apiAuthorizationParams,
      });
    } catch (err) {
      setLoginError(err?.message || String(err));
    } finally {
      setSigningIn(false);
    }
  };

  if (isLoading || signingIn) {
    return redirectingLoader();
  }

  if (isAuthenticated) {
    return <Component />;
  }

  return (
    <div className="page-layout">
      <div className="content-layout">
        <div className="content__body iframe-auth-prompt">
          <p>
            Sign in to continue. Auth0 Universal Login cannot load inside this
            frame; use the button below to sign in via popup (SSO applies if
            you already have an Auth0 session).
          </p>
          <button
            type="button"
            className="button__login"
            onClick={handleLogin}
            disabled={signingIn}
          >
            Sign in
          </button>
          {(loginError || error) && (
            <p className="iframe-auth-prompt__error">
              {loginError || error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const TopLevelAuthenticationGuard = ({ component }) => {
  const GuardedComponent = useMemo(
    () =>
      withAuthenticationRequired(component, {
        onRedirecting: redirectingLoader,
      }),
    [component]
  );

  return <GuardedComponent />;
};

export const AuthenticationGuard = ({ component }) => {
  const [embedded, setEmbedded] = useState(false);

  useEffect(() => {
    setEmbedded(isInIframe());
  }, []);

  if (embedded) {
    return <IframeAuthenticationGuard component={component} />;
  }

  return <TopLevelAuthenticationGuard component={component} />;
};
