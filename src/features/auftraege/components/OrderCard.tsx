import { useState } from 'react';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import type { Order } from '@/types/orders';
import { isOrderAdvanceable, getAdvanceButtonLabel, orderStepLabels, orderStatusColors } from '@/data/orderStatus';
import { Button } from '@/ui';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
  onAdvance: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
      <span style={{ color: 'var(--text-3)', minWidth: '100px' }}>{label}</span>
      <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export function OrderCard({ order, onAdvance, onEdit, onDelete }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const advanceLabel = getAdvanceButtonLabel(order.status);
  const canAdvance = isOrderAdvanceable(order.status);
  const statusColor = orderStatusColors[order.status];

  const deliveryDate = new Date(order.deliveryDate);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const daysUntil = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntil <= 3 && order.status !== 'ready_for_shipping';

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
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-1)' }}>{order.article}</span>
            <OrderStatusBadge status={order.status} />
            {isUrgent && (
              <span style={{
                fontSize: '10px', fontWeight: 700, color: 'var(--error)',
                background: 'color-mix(in srgb, var(--error) 12%, transparent)',
                border: '1px solid color-mix(in srgb, var(--error) 20%, transparent)',
                padding: '2px 6px', borderRadius: '5px',
              }}>
                {daysUntil <= 0 ? 'Überfällig' : `${daysUntil}d`}
              </span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-3)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span>{order.material}</span><span>·</span>
            <span>{order.dimensions}</span><span>·</span>
            <span>{order.quantity} Stk</span><span>·</span>
            <span>{new Date(order.deliveryDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</span>
          </div>
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
            {order.customer && <DetailRow label="Kunde" value={order.customer} />}
            {order.orderNumber && <DetailRow label="Bestellnr." value={order.orderNumber} />}
            <DetailRow label="Lieferdatum" value={new Date(order.deliveryDate).toLocaleDateString('de-DE')} />
            {order.currentStep && <DetailRow label="Nächster Schritt" value={orderStepLabels[order.currentStep]} />}
            {order.notes && <DetailRow label="Notizen" value={order.notes} />}
            <DetailRow label="Erstellt" value={new Date(order.createdAt).toLocaleString('de-DE')} />
          </div>

          <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap' }}>
            {canAdvance && advanceLabel && (
              <button onClick={(e) => { e.stopPropagation(); onAdvance(); }} style={{
                height: '40px', padding: '0 16px', borderRadius: 'var(--radius-md)',
                border: 'none', background: statusColor, color: '#0b0d10',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}>
                {advanceLabel}
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
