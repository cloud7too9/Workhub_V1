import { useState } from 'react';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/ui';
import type { OrderCardProps } from '../types/ui.types';
import { OrderStatusBadge } from './OrderStatusBadge';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
      <span style={{ color: 'var(--text-3)', minWidth: '100px' }}>{label}</span>
      <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export function OrderCard({
  title, statusLabel, statusColor, subtitle, urgencyBadge,
  advanceAction, details, onAdvance, onEdit, onDelete,
}: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      border: `1px solid ${expanded ? statusColor + '50' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-lg)', background: 'var(--surface)',
      overflow: 'hidden', transition: 'border-color 0.2s ease',
    }}>
      {/* Main Row */}
      <div onClick={() => setExpanded(!expanded)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px', cursor: 'pointer', gap: '10px',
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-1)' }}>{title}</span>
            <OrderStatusBadge label={statusLabel} color={statusColor} />
            {urgencyBadge && (
              <span style={{
                fontSize: '10px', fontWeight: 700, color: 'var(--error)',
                background: 'color-mix(in srgb, var(--error) 12%, transparent)',
                border: '1px solid color-mix(in srgb, var(--error) 20%, transparent)',
                padding: '2px 6px', borderRadius: '5px',
              }}>
                {urgencyBadge.label}
              </span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{subtitle}</div>
        </div>
        <ChevronDown size={16} color="var(--text-3)" style={{
          transition: 'transform 0.2s ease',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0,
        }} />
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border-subtle)', animation: 'slideUp 0.2s ease' }}>
          <div style={{ display: 'grid', gap: '8px', padding: '12px 0' }}>
            {details.map((d) => <DetailRow key={d.label} label={d.label} value={d.value} />)}
          </div>

          <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap' }}>
            {advanceAction && (
              <button onClick={(e) => { e.stopPropagation(); onAdvance(); }} style={{
                height: '40px', padding: '0 16px', borderRadius: 'var(--radius-md)',
                border: 'none', background: advanceAction.color, color: '#0b0d10',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}>
                {advanceAction.label}
              </button>
            )}
            <Button variant="secondary" size="sm" icon={<Pencil size={13} />}
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEdit(); }}>
              Bearbeiten
            </Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={13} />}
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onDelete(); }}>
              Löschen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
