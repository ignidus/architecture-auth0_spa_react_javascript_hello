import React, { useEffect, useState } from "react";
import { CodeSnippet } from "../components/code-snippet";
import { PageLayout } from "../components/page-layout";
import { useApiAccessToken } from "../hooks/use-api-access-token";
import { getProtectedResource } from "../services/message.service";

export const ProtectedPage = () => {
  const getApiAccessToken = useApiAccessToken();
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const getMessage = async () => {
      const { data, error } = await getProtectedResource(getApiAccessToken);

      if (!isMounted) {
        return;
      }

      if (data) {
        setMessage(JSON.stringify(data, null, 2));
      }

      if (error) {
        setMessage(JSON.stringify(error, null, 2));
      }
    };

    getMessage();

    return () => {
      isMounted = false;
    };
  }, [getApiAccessToken]);

  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          Protected Page
        </h1>
        <div className="content__body">
          <p id="page-description">
            <span>
              This page retrieves a <strong>protected message</strong> from an
              external API using <code>getAccessTokenSilently</code> and an{" "}
              <code>Authorization: Bearer</code> header (see{" "}
              <code>message.service.js</code>).
            </span>
            <span>
              <strong>Only authenticated users can access this page.</strong>
            </span>
          </p>
          <CodeSnippet title="Protected Message" code={message} />
        </div>
      </div>
    </PageLayout>
  );
};
