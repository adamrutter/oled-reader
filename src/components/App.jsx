import { useHistory, useLocation } from "react-router-dom"
import { Container, Button, Form, InputGroup } from "react-bootstrap"
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import axios from "axios"
import classNames from "classnames"
import gfm from "remark-gfm"
import htmlParser from "react-markdown/plugins/html-parser"
import HtmlToReact from "html-to-react"
import pathParse from "path-parse"
import React, { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import url from "url"
import validUrl from "valid-url"

const App = () => {
  const history = useHistory()
  const location = useLocation()
  const [requestedPage, setRequestedPage] = useState("")
  const [pageLocation, setPageLocation] = useState("")
  const [markdown, setMarkdown] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Get the path of the markdown file, minus the file itself (including protocol)
  const getPageLocation = page => {
    const parsedUrl = url.parse(page)
    return `${parsedUrl.protocol}//${parsedUrl.hostname}${
      pathParse(parsedUrl.pathname).dir
    }`
  }

  /* Try to turn relative paths to absolute paths using the requested page's 
  hostname/directory */
  const attemptAbsoluteLink = link => {
    // If page has no hostname, it is a relative path...
    return !url.parse(link).hostname ? `${pageLocation}/${link}` : link
  }

  /* When the form is submitted, navigate using the form content as a URL query.
  This is done so the user can navigate forward/backward between pages */
  const handleSubmit = e => {
    e.preventDefault()
    history.push(`/?md=${requestedPage}`)
  }

  // Get requested markdown when the URL changes (using the query from handleSubmit)
  useEffect(() => {
    const md = window.location.search
      ? window.location.search.match(/\?md=(.*)/)[1]
      : ""
    if (md) {
      setRequestedPage(md)
      if (validUrl.isUri(md) !== undefined) {
        setPageLocation(getPageLocation(md))
        axios
          .get(md)
          .then(res => {
            setErrorMessage("")
            setMarkdown(res.data)
          })
          .catch(err => {
            setErrorMessage(err.message)
            setMarkdown("")
          })
      } else {
        setPageLocation("")
        setErrorMessage("Not a valid URL")
      }
    } else {
      setRequestedPage("")
      setMarkdown("")
      setErrorMessage("")
    }
  }, [location])

  // Renderers for ReactMarkdown
  const renderers = {
    code: ({ language, value }) => {
      return (
        <SyntaxHighlighter
          children={value}
          // margin set to null so it can be set in typography.js using rhythm units
          customStyle={{ margin: null }}
          language={language}
          style={a11yDark}
        />
      )
    },
    link: node => (
      <a
        href={attemptAbsoluteLink(node.node.url)}
        rel="noreferrer"
        target="_blank"
      >
        {node.children}
      </a>
    ),
    image: node => (
      <img
        alt={node.alt}
        src={attemptAbsoluteLink(node.src)}
        style={{ background: "white" }}
      />
    ),
  }

  // Custom HTML parsing (to set relative links to absolute)
  const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React)
  const parseHtml = htmlParser({
    isValidNode: node => node.type !== "script",
    processingInstructions: [
      {
        shouldProcessNode: node => node.name === "img",
        processNode: node => {
          node.attribs.src = attemptAbsoluteLink(node.attribs.src)
          node.attribs.style += ";background:white"
          return processNodeDefinitions.processDefaultNode(node)
        },
      },
      {
        shouldProcessNode: node => node.name === "a",
        processNode: node => {
          node.attribs.href = attemptAbsoluteLink(node.attribs.href)
          return processNodeDefinitions.processDefaultNode(node)
        },
      },
      {
        shouldProcessNode: () => true,
        processNode: processNodeDefinitions.processDefaultNode,
      },
    ],
  })

  return (
    <>
      <Container className={classNames("my-5")} style={{ maxWidth: "35em" }}>
        <Form onSubmit={handleSubmit}>
          <InputGroup className={classNames("mb-5")}>
            <Form.Control
              onChange={e => setRequestedPage(e.target.value)}
              placeholder="Page to be read..."
              type="text"
              value={requestedPage}
            />
            <InputGroup.Append>
              <Button
                className={classNames("border-0")}
                variant="dark"
                type="submit"
              >
                Read
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
        <main>
          {!markdown && !errorMessage && (
            <>
              <p>
                Enter the URL for a <code>.md</code> file in the input above.
              </p>
              <p>Install the site as a PWA for a fullscreen interface.</p>
            </>
          )}
          {errorMessage && (
            <div>
              <span className={classNames("font-weight-bold")}>Error</span>:{" "}
              {errorMessage}
            </div>
          )}
          {markdown && (
            <ReactMarkdown
              allowDangerousHtml
              astPlugins={[parseHtml]}
              plugins={[gfm]}
              renderers={renderers}
            >
              {markdown}
            </ReactMarkdown>
          )}
        </main>
      </Container>
    </>
  )
}

export default App
