import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useMemo, useState } from "react";
import { CodeSnippet } from "../components/code-snippet";
import { PageLayout } from "../components/page-layout";
import { jwtDecode } from "jwt-decode";

const ORG_ID   = process.env.REACT_APP_AUTH0_ORG_ID;
const AUDIENCE = process.env.REACT_APP_AUTH0_API_AUDIENCE_URL;
const MARKETPLACE_LINK_ONE  = process.env.REACT_APP_ISC_MARKETPLACE_LINK_ONE;
const MARKETPLACE_LABEL_ONE = process.env.REACT_APP_ISC_MARKETPLACE_LINK_ONE_LABEL;
const ISC_TITLE = process.env.REACT_APP_ISC_TITLE;

export const ProfilePage = () => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: AUDIENCE,
            organization: ORG_ID
          },
        });
        setAccessToken(token);
      } catch (err) {
        console.error(err);
      }
    };

    if (isAuthenticated) {
      getToken();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

    // Decode safely at render time (no extra effects)
    const claims = useMemo(() => {
      if (typeof accessToken !== "string" || accessToken.length === 0) return null;
      if (accessToken.split(".").length !== 3) return null; // not a JWT (e.g., opaque)
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
          { ISC_TITLE } Profile Page
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
                title="Decoded Access Token"
                code={
                  claims
                    ? JSON.stringify(claims, null, 2)
                    : "Waiting for token..."
                }
              />
            </div>

            <div className="profile__details">
              <h2 className="profile__title">ISC Marketplace</h2>
              <button
                onClick={() => (window.location.href = MARKETPLACE_LINK_ONE)}
                className="button__login" style={{ marginTop: "48px" }}
              >
                { MARKETPLACE_LABEL_ONE }
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
