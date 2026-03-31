import { useState, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Topbar } from './components/layout/Topbar';
import { Drawer } from './components/layout/Drawer';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { routes, getPageTitle, getRoute } from './data/navigation';

export function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const current = getPageTitle(location.pathname);
  const route = getRoute(location.pathname);
  const hideChrome = route?.hideChrome ?? false;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {!hideChrome && (
        <Topbar
          title={current.title}
          subtitle={current.subtitle}
          onMenuClick={() => setDrawerOpen(true)}
        />
      )}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main style={{ flex: 1 }}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Routes>
              {routes.map((r) => (
                <Route key={r.path} path={r.path} element={<r.component />} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
