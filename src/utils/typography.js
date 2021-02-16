import Typography from "typography"

const typography = new Typography({
  bodyColor: "white",
  baseFontSize: "16px",
  baseLineHeight: 1.7,
  bodyFontFamily: ["Open Sans", "sans-serif"],
  headerColor: "lightgrey",
  headerFontFamily: ["Merriweather", "serif"],
  googleFonts: [
    {
      name: "Open Sans",
      styles: ["400", "400i", "700", "700i"],
    },
    {
      name: "Merriweather",
      styles: ["400", "400i", "700", "700i"],
    },
  ],
  overrideStyles: ({ rhythm }, options, styles) => ({
    "h1, h2, h3, h4, h5, h6": {
      marginTop: rhythm(3),
    },
    blockquote: {
      fontStyle: "italic",
    },
    pre: {
      marginBottom: rhythm(1),
    },
    "p :last-child": {
      marginBottom: styles.p.marginBottom,
    },
  }),
  scaleRatio: 2.5,
})

export default typography
