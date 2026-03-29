import { tokens } from '../styles/tokens';

export function Auftraege() {
  return (
    <div style={{ padding: 20 }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: tokens.text,
          marginBottom: 8,
        }}
      >
        Aufträge
      </h2>
      <p style={{ fontSize: 14, color: tokens.muted }}>
        Kommt bald — Auftragsverwaltung.
      </p>
    </div>
  );
}
