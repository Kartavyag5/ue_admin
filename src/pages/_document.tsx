import React from "react"
import { Html, Head, Main, NextScript } from 'next/document'
import ImageURLs from "../lib/images"

export default function Document() {
  return (
    <Html>
        <Head>
            <link rel="shortcut icon" href={ImageURLs.favIcon} />
        </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}