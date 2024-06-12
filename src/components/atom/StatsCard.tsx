import { Card } from 'flowbite-react';

export type ValuTypeProp = 'number' | 'percntage';

export const DashbordUsageCard = ({ statName, value }: { statName: string; value: number }) => {
  return (
    <>
      <Card className="max-w-sm mx-2 my-1 dark:bg-gray-700 h-full">
        <h5 className="font-semibold text-gray-500 dark:text-gray-400">{statName}</h5>
        <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</p>
      </Card>
    </>
  );
};
