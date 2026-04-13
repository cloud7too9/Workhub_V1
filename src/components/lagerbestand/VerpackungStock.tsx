import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../styles/tokens';
import { SearchInput } from '../shared/SearchInput';
import { kartonData, kartonSizes } from '../../data/kartonData';

interface LogEntry {
  id: number;
  size: string;
  delta: string;
  newVal: number;
  time: string;
}

export function VerpackungStock() {
  const navigate = useNavigate();

  const [stock, setStock] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    kartonSizes.forEach((size) => {
      init[size] = 0;
    });
    return init;
  });

  const [minStock, setMinStock] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    kartonSizes.forEach((size) => {
      init[size] = 10;
    });
    return init;
  });

  const [openKarton, setOpenKarton] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [log, setLog] = useState<LogEntry[]>([]);

  const adjustStock = (size: string, delta: number) => {
    const newVal = Math.max(0, (stock[size] || 0) + delta);
    const action = delta > 0 ? '+' : '';
    setLog((prev) => [
      {
        id: Date.now(),
        size,
        delta: `${action}${delta}`,
        newVal,
        time: new Date().toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      ...prev.slice(0, 19),
    ]);
    setStock((s) => ({ ...s, [size]: newVal }));
  };

  const setStockDirect = (size: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setStock((s) => ({ ...s, [size]: num }));
  };

  const setMinStockVal = (size: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setMinStock((s) => ({ ...s, [size]: num }));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return kartonData;
    return kartonData.filter(
      (k) =>
        k.size.toLowerCase().includes(q) ||
        k.articles.some(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.group.toLowerCase().includes(q),
        ),
    );
  }, [search]);

  const lowStockCount = Object.entries(stock).filter(
    ([size, v]) => v < (minStock[size] || 10),
  ).length;

  const parseDims = (size: string) => {
    const parts = size.split('x');
    return { l: parts[0], b: parts[1], h: parts[2] };
  };

  return (
    <div>
      {/* Back + Header */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={() => navigate('/lagerbestand')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
            color: tokens.accent,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={tokens.accent}
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Lagerbestand
        </button>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: tokens.radius.md,
              background: tokens.surface,
              border: `1px solid ${lowStockCount > 0 ? tokens.warning + '40' : tokens.border}`,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: tokens.font.mono,
                color: lowStockCount > 0 ? tokens.warning : tokens.success,
              }}
            >
              {lowStockCount}
            </div>
            <div style={{ fontSize: 11, color: tokens.muted }}>Unter Mindestbestand</div>
          </div>
          <div
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: tokens.radius.md,
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: tokens.accent,
                fontFamily: tokens.font.mono,
              }}
            >
              {kartonSizes.length}
            </div>
            <div style={{ fontSize: 11, color: tokens.muted }}>Kartongr\u00f6\u00dfen</div>
          </div>
        </div>

        {/* Search */}
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Kartongr\u00f6\u00dfe oder Artikel suchen\u2026"
        />
      </div>

      {/* Karton Cards */}
      <div
        style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {filtered.map((k) => {
          const isOpen = openKarton === k.size;
          const qty = stock[k.size] || 0;
          const min = minStock[k.size] || 10;
          const isLow = qty < min;
          const dims = parseDims(k.size);

          return (
            <div
              key={k.size}
              style={{
                background: tokens.surface,
                border: `1px solid ${isOpen ? '#60a5fa50' : isLow ? tokens.warning + '30' : tokens.border}`,
                borderRadius: tokens.radius.lg,
                overflow: 'hidden',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: isOpen
                  ? '0 0 24px #60a5fa10'
                  : isLow
                    ? `0 0 12px ${tokens.warning}08`
                    : 'none',
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  minHeight: tokens.touch.minHeight,
                  gap: 10,
                }}
              >
                {/* Expand toggle */}
                <button
                  onClick={() => setOpenKarton(isOpen ? null : k.size)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: tokens.bg,
                    border: `1px solid ${tokens.border}`,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={tokens.muted}
                    strokeWidth="2"
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Karton size + info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: tokens.text,
                        fontFamily: tokens.font.mono,
                      }}
                    >
                      {k.size}
                    </span>
                    {isLow && (
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: tokens.warning,
                          boxShadow: `0 0 8px ${tokens.warning}80`,
                        }}
                      />
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: tokens.muted, marginTop: 1 }}>
                    {dims.l}\u00d7{dims.b}\u00d7{dims.h} mm \u00b7 {k.articles.length} Artikel
                  </div>
                </div>

                {/* Stock input + buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                  <button
                    onClick={() => adjustStock(k.size, -1)}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: `${tokens.danger}12`,
                      border: `1px solid ${tokens.danger}25`,
                      color: tokens.danger,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={qty}
                    onChange={(e) => setStockDirect(k.size, e.target.value)}
                    style={{
                      width: 52,
                      height: 34,
                      borderRadius: 8,
                      textAlign: 'center',
                      background: tokens.bg,
                      border: `1px solid ${tokens.border}`,
                      color: isLow ? tokens.warning : tokens.text,
                      fontSize: 15,
                      fontWeight: 700,
                      fontFamily: tokens.font.mono,
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => adjustStock(k.size, 1)}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: `${tokens.success}12`,
                      border: `1px solid ${tokens.success}25`,
                      color: tokens.success,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Min-stock row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  padding: '0 16px 10px',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 11, color: tokens.muted }}>Mindestbestand:</span>
                <input
                  type="number"
                  min="0"
                  value={min}
                  onChange={(e) => setMinStockVal(k.size, e.target.value)}
                  style={{
                    width: 44,
                    height: 26,
                    borderRadius: 6,
                    textAlign: 'center',
                    background: tokens.bg,
                    border: `1px solid ${tokens.border}`,
                    color: tokens.textSecondary,
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: tokens.font.mono,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Expanded: articles using this karton */}
              {isOpen && (
                <div style={{ padding: '0 16px 14px' }}>
                  <div
                    style={{
                      background: tokens.bg,
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: `1px solid ${tokens.border}`,
                    }}
                  >
                    {/* Table header */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 70px 55px 55px',
                        gap: 6,
                        padding: '8px 12px',
                        borderBottom: `1px solid ${tokens.border}`,
                      }}
                    >
                      {['Artikel', 'Gruppe', 'H\u00f6he', '\u00d8 mm'].map((h) => (
                        <span
                          key={h}
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: tokens.muted,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Article rows */}
                    {k.articles.map((a, i) => (
                      <div
                        key={a.name}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 70px 55px 55px',
                          gap: 6,
                          padding: '10px 12px',
                          borderBottom:
                            i < k.articles.length - 1
                              ? `1px solid ${tokens.border}`
                              : 'none',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: tokens.text,
                            fontFamily: tokens.font.mono,
                          }}
                        >
                          {a.name}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: '#f59e0b',
                            background: '#f59e0b18',
                            border: '1px solid #f59e0b30',
                            padding: '2px 6px',
                            borderRadius: 5,
                            width: 'fit-content',
                            textAlign: 'center',
                          }}
                        >
                          {a.group}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: tokens.textSecondary,
                            fontFamily: tokens.font.mono,
                          }}
                        >
                          {a.height}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: tokens.textSecondary,
                            fontFamily: tokens.font.mono,
                          }}
                        >
                          {a.diameter}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div
            style={{ textAlign: 'center', padding: 40, color: tokens.muted, fontSize: 14 }}
          >
            Kein Ergebnis f\u00fcr \u201e{search}\u201c
          </div>
        )}
      </div>

      {/* Recent log */}
      {log.length > 0 && (
        <div style={{ padding: '0 14px 20px' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: tokens.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}
          >
            Letzte Buchungen
          </div>
          <div
            style={{
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: tokens.radius.md,
              overflow: 'hidden',
            }}
          >
            {log.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: `1px solid ${tokens.border}`,
                  fontSize: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{ fontFamily: tokens.font.mono, color: tokens.muted, fontSize: 11 }}
                  >
                    {entry.time}
                  </span>
                  <span
                    style={{
                      fontFamily: tokens.font.mono,
                      color: tokens.text,
                      fontWeight: 600,
                    }}
                  >
                    {entry.size}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      fontFamily: tokens.font.mono,
                      fontWeight: 700,
                      fontSize: 13,
                      color: entry.delta.startsWith('+') ? tokens.success : tokens.danger,
                    }}
                  >
                    {entry.delta}
                  </span>
                  <span
                    style={{ fontFamily: tokens.font.mono, color: tokens.muted, fontSize: 11 }}
                  >
                    \u2192 {entry.newVal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
