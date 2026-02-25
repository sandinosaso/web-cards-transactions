import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import styled from "styled-components";

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  font-size: 1.5rem;
  color: #c92a2a;
  margin-bottom: 16px;
`;

const ErrorBody = styled.p`
  color: #6c757d;
  margin-bottom: 24px;
`;

const ReloadButton = styled.button`
  background-color: #3b5bdb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #364fc7;
  }

  &:focus-visible {
    outline: 2px solid #4dabf7;
    outline-offset: 2px;
  }
`;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production, send to error monitoring (e.g. Sentry)
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorWrapper role="alert">
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorBody>
            An unexpected error occurred. Please try reloading the page.
          </ErrorBody>
          <ReloadButton
            type="button"
            onClick={() => window.location.reload()}
          >
            Reload page
          </ReloadButton>
        </ErrorWrapper>
      );
    }

    return this.props.children;
  }
}
