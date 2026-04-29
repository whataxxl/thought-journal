import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function MasonryGrid({ children }: Props) {
  return (
    <div
      className="columns-1 sm:columns-2 md:columns-3 gap-3"
      style={{ columnFill: 'auto' }}
    >
      {children}
    </div>
  );
}
