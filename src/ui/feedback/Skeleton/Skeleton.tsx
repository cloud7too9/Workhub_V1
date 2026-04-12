interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
  variant?: 'text' | 'circle' | 'rect';
}

export function Skeleton({ width, height, radius, variant = 'rect' }: SkeletonProps) {
  const styles: Record<string, React.CSSProperties> = {
    text: { width: width ?? '100%', height: height ?? '14px', borderRadius: radius ?? '4px' },
    circle: { width: width ?? '40px', height: height ?? '40px', borderRadius: '50%' },
    rect: { width: width ?? '100%', height: height ?? '48px', borderRadius: radius ?? 'var(--radius-md)' },
  };

  return (
    <div style={{
      ...styles[variant],
      background: 'linear-gradient(90deg, var(--surface-alt) 25%, var(--border-subtle) 50%, var(--surface-alt) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s ease infinite',
    }} />
  );
}

export function SkeletonCard() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
      <Skeleton variant="circle" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" height="12px" />
      </div>
    </div>
  );
}
