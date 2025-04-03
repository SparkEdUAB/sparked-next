import React from 'react';

export function SearchSkeleton() {
    return (
        <div className="mt-6 px-3">
            <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array(10).fill(0).map((_, index) => (
                    <div key={index} className="flex flex-col">
                        <div className="h-40 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}