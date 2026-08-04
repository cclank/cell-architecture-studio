import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
  /** Change this to reset the boundary (e.g. when the selected visual changes). */
  resetKey?: string | number;
  onError?: (error: Error) => void;
};

type State = { hasError: boolean };

// Generic error boundary. Used both inside the R3F canvas (so an HDR/asset
// fetch failure can't take down the whole app) and around the 3D scene (so a
// WebGL/model failure degrades to a poster instead of a blank screen).
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
