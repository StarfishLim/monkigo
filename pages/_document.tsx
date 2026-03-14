import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/icon-banana.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>MonkiGo</title>
        <meta name="theme-color" content="#FFE066" />
        <meta name="description" content="MonkiGo: discover hidden monkey artworks at Upper Thomson MRT." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

