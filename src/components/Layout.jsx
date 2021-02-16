import "../styles/main.scss"
import { Helmet } from "react-helmet"
import React from "react"
import typography from "../utils/typography"

const Layout = props => {
  return (
    <>
      <Helmet>
        <link
          href={`//fonts.googleapis.com/css?${typography.options.googleFonts
            .map(font => `family=${font.name}:${font.styles.join(",")}`)
            .join("|")}`}
          rel="stylesheet"
          type="text/css"
        />
        <style>{typography.toString()}</style>
      </Helmet>
      {props.children}
    </>
  )
}

export default Layout
