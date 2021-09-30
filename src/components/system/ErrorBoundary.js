import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null,
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    })
  }

  render() {
    const { error, errorInfo } = this.state
    const { children } = this.props

    if (errorInfo) {
      return (
        <div>
          <h4>Something went wrong:</h4>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {
              error && (
                <summary>{ error.toString() }</summary>
              )
            }
            <br />
            {errorInfo.componentStack}
          </details>
        </div>
      )
    }
    return children
  }
}

export default ErrorBoundary
