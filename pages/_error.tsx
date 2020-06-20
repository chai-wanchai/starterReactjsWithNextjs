import { Component } from 'react'
import ErrorApp from '../src/modules/ErrorApp'

interface ErrorPageProps {
  statusCode: number
}

interface ErrorMessage {
  codeTitle: string
  title: string
  message: string
}

// End typescript defined -------------------------------

const getErrorMessage = (statusCode): ErrorMessage => {
  switch (statusCode) {
    case 401:
      return {
        codeTitle: "Unauthorized",
        title: "Sorry, we can\'\t authorized that page!",
        message: "Authentication was provided, but the authenticated user is not permitted to perform the requested operation."
      }
    case 403:
      return {
        codeTitle: "Forbidden",
        title: "Sorry, you not have permission",
        message: "Authentication was provided, but the authenticated user is not permitted to perform the requested operation."
      }
    case 404:
      return {
        codeTitle: "Page not found",
        title: "Sorry, we can't find that page!",
        message: "Either something went wrong or the page doesn't exist anymore."
      }
    case 500:
      return {
        codeTitle: "Internal Server Error",
        title: "Sorry, something went wrong",
        message: "It looks as though we've broken something on our system"
      }
    default:
      return {
        codeTitle: 'Unknown',
        title: "An error occurred on the server",
        message: "Please try agin."
      }
  }
}

class ErrorPage extends Component<ErrorPageProps> {
  static getInitialProps({ res, err, query }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : query.statusCode ? parseInt(query.statusCode) : null
    return {
      statusCode,
      layout: 'none'
    }
  }

  render() {
    const { statusCode } = this.props
    const errorMsg = getErrorMessage(statusCode)

    return (
      <ErrorApp {...errorMsg} statusCode={statusCode} />
    )
  }
}

export default ErrorPage
