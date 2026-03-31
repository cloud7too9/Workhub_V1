import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { tokens } from '../../styles/tokens';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[WorkHub] Unhandled error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: 32,
            textAlign: 'center',
            gap: 16,
          }}
        >
          <div style={{ fontSize: 40, opacity: 0.3 }}>⚠</div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: tokens.text,
              margin: 0,
            }}
          >
            Etwas ist schiefgelaufen
          </h2>
          <p
            style={{
              fontSize: 13,
              color: tokens.muted,
              maxWidth: 360,
              lineHeight: 1.5,
            }}
          >
            {this.state.error?.message ?? 'Unbekannter Fehler'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
            style={{
              height: 44,
              padding: '0 24px',
              borderRadius: 12,
              border: `1px solid ${tokens.accent}40`,
              background: tokens.accentDim,
              color: tokens.accent,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: tokens.font.ui,
              cursor: 'pointer',
            }}
          >
            Zurück zum Start
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
