import * as React from 'react';

import { Head } from '../seo';

type WatchlistLayoutProps = {
  children: React.ReactNode;
  title?: string;
  head?: string;
};

export const WatchlistLayout = ({
  children,
  title,
  head,
}: WatchlistLayoutProps) => {
  return (
    <>
      <Head title={head} />
      <div className="py-4 flex flex-col gap-4">
        <div className="px-4 sm:px-2 md:px-4">
          <h1 className="text-2xl font-semibold text-primary">{title}</h1>
        </div>
        <div className="px-4 sm:px-2 md:px-4">{children}</div>
      </div>
    </>
  );
};
