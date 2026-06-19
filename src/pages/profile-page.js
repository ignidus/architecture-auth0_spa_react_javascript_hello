import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useMemo, useState } from "react";
import { CodeSnippet } from "../components/code-snippet";
import { PageLayout } from "../components/page-layout";
import { useApiAccessToken } from "../hooks/use-api-access-token";
import { jwtDecode } from "jwt-decode";

const MARKETPLACE_LINK_ONE = process.env.REACT_APP_ISC_MARKETPLACE_LINK_ONE;
const MARKETPLACE_LABEL_ONE = process.env.REACT_APP_ISC_MARKETPLACE_LINK_ONE_LABEL;
const ISC_TITLE = process.env.REACT_APP_ISC_TITLE;
const USE_REFRESH_TOKENS =
  process.env.REACT_APP_AUTH0_USE_REFRESH_TOKENS === "true";

export const ProfilePage = () => {
  const { isAuthenticated, user } = useAuth0();
  const getApiAccessToken = useApiAccessToken();
  const [accessToken, setAccessToken] = useState(null);
  const [tokenError, setTokenError] = useState(null);
  const [iframeOpen, setIframeOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadToken = async () => {
      setTokenError(null);
      try {
        const token = await getApiAccessToken();
        if (!cancelled) {
          setAccessToken(token);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          const hint =
            err?.error === "missing_refresh_token"
              ? " Enable Refresh Token Rotation in Auth0, set REACT_APP_AUTH0_USE_REFRESH_TOKENS=true, then log out and sign in again."
              : "";
          setTokenError((err?.message || String(err)) + hint);
        }
      }
    };

    if (isAuthenticated) {
      loadToken();
    }

    return () => {
      cancelled = true;
    };
  }, [getApiAccessToken, isAuthenticated]);

  const claims = useMemo(() => {
    if (typeof accessToken !== "string" || accessToken.length === 0) return null;
    if (accessToken.split(".").length !== 3) return null;
    try {
      return jwtDecode(accessToken);
    } catch {
      return null;
    }
  }, [accessToken]);

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          {ISC_TITLE} Profile Page
        </h1>
        <div className="content__body">
          <p id="page-description">
            <span>
              You can use the <strong>ID Token</strong> to get the profile
              information of an authenticated user.
            </span>
            <span>
              <strong>Only authenticated users can access this page.</strong>
            </span>
          </p>
          <div className="profile-grid">
            <div className="profile__header">
              <img
                src={user.picture}
                alt="Profile"
                className="profile__avatar"
              />
              <div className="profile__headline">
                <h2 className="profile__title">{user.name}</h2>
                <span className="profile__description">{user.email}</span>
              </div>
            </div>
            <div className="profile__details">
              <CodeSnippet
                title="Decoded ID Token"
                code={JSON.stringify(user, null, 2)}
              />
            </div>
            <div className="profile__details">
              <CodeSnippet
                title="Decoded Access Token (this app’s API audience only)"
                code={
                  tokenError
                    ? tokenError
                    : claims
                      ? JSON.stringify(claims, null, 2)
                      : "Waiting for token..."
                }
              />
              {!USE_REFRESH_TOKENS && !tokenError && (
                <p className="profile__token-hint">
                  Set <code>REACT_APP_AUTH0_USE_REFRESH_TOKENS=true</code> so{" "}
                  <code>getAccessTokenSilently</code> uses refresh tokens
                  (Safari-safe) instead of an auth0.com iframe.
                </p>
              )}
            </div>

            <div className="profile__details">
              <h2 className="profile__title">ISC Marketplace</h2>
              <p className="profile__marketplace-note">
                Event Helper is a separate SPA (different origin, client ID, and
                API audience). When embedded, it signs in via popup (Auth0
                Universal Login cannot render inside an iframe). Use Sign in
                inside the frame, or the full-page button for redirect login.
              </p>
              <div className="profile__marketplace-actions">
                <button
                  onClick={() => (window.location.href = MARKETPLACE_LINK_ONE)}
                  className="button__login"
                >
                  {MARKETPLACE_LABEL_ONE}
                </button>
                <button
                  type="button"
                  onClick={() => setIframeOpen((open) => !open)}
                  className="button__login"
                >
                  {iframeOpen
                    ? `Hide ${MARKETPLACE_LABEL_ONE} (inline)`
                    : `Show ${MARKETPLACE_LABEL_ONE} (inline)`}
                </button>
              </div>
              {iframeOpen && MARKETPLACE_LINK_ONE && (
                <iframe
                  src={MARKETPLACE_LINK_ONE}
                  title={MARKETPLACE_LABEL_ONE}
                  className="profile__iframe"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
