'use client';

import React, { Suspense, ReactNode } from 'react';
import CreateNew from '@/components/global/CreateNew';
import ListSkeleton from '@/components/global/ListSkeleton';

export default function GenericListWrapper<T>({
  title,
  createNewHref,
  createNewTitle,
  items,
  isLoading = false,
  renderItem,
  emptyMessage = "Aucun élément trouvé.",
  statsComponent
}: GenericListWrapperProps<T>) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <CreateNew href={createNewHref} title={createNewTitle} />
      </div>
      
      {statsComponent && (
        <div className="mb-6">
          {statsComponent}
        </div>
      )}
      
      <div className="overflow-hidden">
        {isLoading ? (
          <ListSkeleton />
        ) : items.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            <p>{emptyMessage}</p>
            <p className="mt-2">
              <a href={createNewHref} className="text-blue-500 hover:underline">
                Cliquez ici pour ajouter votre premier élément
              </a>
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <Suspense fallback={<ListSkeleton />}>
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  {renderItem(item)}
                </React.Fragment>
              ))}
            </Suspense>
          </div>
        )}
      </div>
    </>
  );
}

interface GenericListWrapperProps<T> {
  title: string;
  createNewHref: string;
  createNewTitle: string;
  items: T[];
  isLoading?: boolean;
  renderItem: (item: T) => ReactNode;
  onDelete: (id: number) => void;
  emptyMessage?: string;
  statsComponent?: ReactNode;
}