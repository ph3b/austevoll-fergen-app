import React from "react";
import Head from "next/head";
import stylesheet from "../css/index.scss";

export default ({ children }) => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Austevoll</title>
    </Head>
    <link
      href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500"
      rel="stylesheet"
    />
    <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
    {children}
  </div>
);
