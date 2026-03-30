import type { Order } from '../../types/orders';
import { tokens } from '../../styles/tokens';
import { OrderStatusBadge } from './OrderStatusBadge';
import { orderStatusColors } from '../../data/orderStatus';
import { sawRelevantFields, extractedFieldLabels } from '../../types/orders';

interface OrderCardProps {
  order: Order;
  onOpen: () => void;
}

export function OrderCard({ order, onOpen }: OrderCardProps) {
  const statusColor = orderStatusColors[order.status];
  const hasDrawing = !!order.images.drawingImage;

  // Säge-relevante bestätigte Felder für Fortschrittsanzeige

  // Anzeige-Titel
  const displayTitle =
    order.extracted.article?.value || order.article || 'Scan-Auftrag';

  // Lieferdatum-Logik
  const hasDelivery = !!order.deliveryDate;
  let daysUntil = 0;
  let isUrgent = false;
  if (hasDelivery) {
    const deliveryDate = new Date(order.deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    daysUntil = Math.ceil(
      (deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    isUrgent = daysUntil <= 3 && order.status !== 'done';
  }

  // Kompakte Säge-Info-Zeile
  const sawPreview: string[] = [];
  const matVal = order.extracted.material?.value || order.material;
  if (matVal) sawPreview.push(matVal);
  const sawVal = order.extracted.sawMeasure?.value;
  if (sawVal) sawPreview.push(sawVal);
  const qtyVal = order.extracted.quantity?.value || (order.quantity > 0 ? `${order.quantity}` : '');
  if (qtyVal) sawPreview.push(`${qtyVal} Stk`);

  return (
    <div
      onClick={onOpen}
      style={{
        border: `1px solid ${tokens.border}`,
        borderRadius: 16,
        background: tokens.surface,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease, transform 0.1s ease',
        borderLeft: `3px solid ${statusColor}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '14px',
          gap: 12,
        }}
      >
        {/* Zeichnungs-Thumbnail */}
        {hasDrawing && (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              overflow: 'hidden',
              flexShrink: 0,
              border: `1px solid ${tokens.border}`,
            }}
          >
            <img
              src={order.images.drawingImage!}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: tokens.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayTitle}
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

          {/* Säge-Preview */}
          <div
            style={{
              fontSize: 12,
              color: tokens.muted,
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {sawPreview.length > 0 ? (
              sawPreview.map((s, i) => (
                <span key={i}>
                  {i > 0 && <span style={{ marginRight: 6 }}>·</span>}
                  {s}
                </span>
              ))
            ) : (
              <span style={{ fontStyle: 'italic' }}>Felder noch leer</span>
            )}
          </div>

          {/* Feld-Fortschritt */}
          <div
            style={{
              display: 'flex',
              gap: 3,
              marginTop: 6,
            }}
          >
            {sawRelevantFields.map((key) => {
              const field = order.extracted[key];
              const filled = !!field?.value;
              const confirmed = !!field?.confirmed;
              return (
                <div
                  key={key}
                  title={extractedFieldLabels[key]}
                  style={{
                    width: 18,
                    height: 4,
                    borderRadius: 2,
                    background: confirmed
                      ? tokens.success
                      : filled
                        ? tokens.warning
                        : `${tokens.muted}30`,
                    transition: 'background 0.2s ease',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={tokens.muted}
          strokeWidth="2"
          style={{ flexShrink: 0 }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}
