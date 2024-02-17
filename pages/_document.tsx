import { Html, Head, Main, NextScript } from "next/document";
import { css, Global } from "@emotion/react";
import { ChakraProvider, theme } from "@chakra-ui/react";

const GlobalStyles = css`
  @font-face {
    font-family: "CentraMono";
    src: url("/fonts/CentraMono-Book.ttf");
    font-style: normal;
    font-weight: 400;
    font-display: swap;
  }
  @font-face {
    font-family: "CentraNo2";
    src: url("/fonts/CentraNo2-Bold.ttf");
    font-style: normal;
    font-weight: 700;
    font-display: swap;
  }
  @font-face {
    font-family: "CentraNo2";
    src: url("/fonts/CentraNo2-Book.ttf");
    font-style: normal;
    font-weight: 400;
    font-display: swap;
  }
  @font-face {
    font-family: "CentraNo2";
    src: url("/fonts/CentraNo2-Medium.ttf");
    font-style: normal;
    font-weight: 500;
    font-display: swap;
  }

  ::selection {
    background: #feedc7; /* WebKit/Blink Browsers */
  }

  ::-moz-selection {
    background: #feedc7; /* Gecko Browsers */
  }

  html {
    height: 100%;
    padding: 48px;
  }

  body {
    height: 100%;
    padding: 24px;
    overflow-y: auto;
    box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.05);
    margin: 0;
    font-family: CentraNo2, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
      Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
      sans-serif;
  }

  #__next {
    height: 100%;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #adaaa6 !important;
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #adaaa6 !important;
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #adaaa6 !important;
  }
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Global styles={GlobalStyles} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
