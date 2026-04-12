interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'busy';
}

const sizes = { sm: 32, md: 40, lg: 56 };
const fontSizes = { sm: '12px', md: '14px', lg: '18px' };
const statusColors = { online: 'var(--success)', offline: 'var(--text-3)', busy: 'var(--error)' };

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function nameToColor(name: string): string {
  const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length] ?? colors[0]!;
}

export function Avatar({ name, src, size = 'md', status }: AvatarProps) {
  const s = sizes[size];
  const dot = Math.round(s * 0.28);

  return (
    <div style={{ position: 'relative', width: s, height: s, flexShrink: 0 }}>
      {src ? (
        <img src={src} alt={name} style={{ width: s, height: s, borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <div style={{
          width: s, height: s, borderRadius: '50%',
          background: nameToColor(name),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: fontSizes[size], fontWeight: 700, color: '#fff',
          letterSpacing: '0.02em',
        }}>
          {getInitials(name)}
        </div>
      )}
      {status && (
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: dot, height: dot, borderRadius: '50%',
          background: statusColors[status],
          border: '2px solid var(--surface)',
          boxSizing: 'content-box',
        }} />
      )}
    </div>
  );
}
