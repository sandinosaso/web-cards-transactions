import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import styled from "styled-components";

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  text-align: center;
`;

const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.status.error};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorBody = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ReloadButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  cursor: pointer;

  &:hover {
    opacity: 0.88;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
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
