import { Skeleton, SkeletonCard } from './Skeleton';

export const skeletonPreviews = {
  id: 'skeleton',
  name: 'Skeleton',
  sections: [
    {
      title: 'Grundformen',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Skeleton variant="text" />
          <Skeleton variant="text" width="75%" />
          <Skeleton variant="text" width="50%" />
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Skeleton variant="circle" />
            <Skeleton variant="circle" width="32px" height="32px" />
            <Skeleton variant="circle" width="24px" height="24px" />
          </div>
          <Skeleton variant="rect" height="120px" />
        </div>
      ),
    },
    {
      title: 'Karten-Platzhalter',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ),
    },
  ],
};
