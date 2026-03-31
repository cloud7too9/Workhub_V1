import { useState } from 'react';
import type { Order } from '../../types/orders';
import { tokens } from '../../styles/tokens';
import { OrderStatusBadge } from './OrderStatusBadge';
import {
  isOrderAdvanceable,
  getAdvanceButtonLabel,
  orderStepLabels,
  orderStatusColors,
} from '../../data/orderStatus';

interface OrderCardProps {
  order: Order;
  onAdvance: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function OrderCard({ order, onAdvance, onEdit, onDelete }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  const advanceLabel = getAdvanceButtonLabel(order.status);
  const canAdvance = isOrderAdvanceable(order.status);
  const statusColor = orderStatusColors[order.status];

  const deliveryDate = new Date(order.deliveryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntil = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntil <= 3 && order.status !== 'ready_for_shipping';

  return (
    <div
      style={{
        border: `1px solid ${expanded ? statusColor + '50' : tokens.border}`,
        borderRadius: 16,
        background: tokens.surface,
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Main Row */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 14px',
          cursor: 'pointer',
          gap: 10,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: tokens.text }}>
              {order.article}
            </span>
            <OrderStatusBadge status={order.status} />
            {isUrgent && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: tokens.danger,
                  background: `${tokens.danger}18`,
                  border: `1px solid ${tokens.danger}30`,
                  padding: '2px 6px',
                  borderRadius: 5,
                }}
              >
                {daysUntil <= 0 ? 'Überfällig' : `${daysUntil}d`}
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: tokens.muted, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span>{order.material}</span>
            <span>·</span>
            <span>{order.dimensions}</span>
            <span>·</span>
            <span>{order.quantity} Stk</span>
            <span>·</span>
            <span>
              {new Date(order.deliveryDate).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
              })}
            </span>
          </div>
        </div>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={tokens.muted}
          strokeWidth="2"
          style={{
            transition: 'transform 0.2s ease',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div
          style={{
            padding: '0 14px 14px',
            borderTop: `1px solid ${tokens.border}`,
            animation: 'fadeSlideDown 0.2s ease',
          }}
        >
          {/* Detail rows */}
          <div style={{ display: 'grid', gap: 8, padding: '12px 0' }}>
            {order.customer && (
              <DetailRow label="Kunde" value={order.customer} />
            )}
            {order.orderNumber && (
              <DetailRow label="Bestellnr." value={order.orderNumber} />
            )}
            <DetailRow
              label="Lieferdatum"
              value={new Date(order.deliveryDate).toLocaleDateString('de-DE')}
            />
            {order.currentStep && (
              <DetailRow
                label="Nächster Schritt"
                value={orderStepLabels[order.currentStep]}
              />
            )}
            {order.notes && (
              <DetailRow label="Notizen" value={order.notes} />
            )}
            <DetailRow
              label="Erstellt"
              value={new Date(order.createdAt).toLocaleString('de-DE')}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {canAdvance && advanceLabel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdvance();
                }}
                style={{
                  height: 40,
                  padding: '0 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: statusColor,
                  color: '#0b0d10',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: tokens.font.ui,
                }}
              >
                {advanceLabel}
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              style={{
                height: 40,
                padding: '0 14px',
                borderRadius: 10,
                border: `1px solid ${tokens.border}`,
                background: 'transparent',
                color: tokens.accent,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: tokens.font.ui,
              }}
            >
              ✎ Bearbeiten
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              style={{
                height: 40,
                padding: '0 14px',
                borderRadius: 10,
                border: `1px solid ${tokens.danger}40`,
                background: `${tokens.danger}18`,
                color: tokens.danger,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: tokens.font.ui,
              }}
            >
              Löschen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, fontSize: 13 }}>
      <span style={{ color: tokens.muted, minWidth: 100 }}>{label}</span>
      <span style={{ color: tokens.text, fontWeight: 500 }}>{value}</span>
    </div>
  );
}
