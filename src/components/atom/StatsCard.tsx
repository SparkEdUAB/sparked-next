import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import { Card } from 'flowbite-react';
import i18next from 'i18next';
import Link from 'next/link';

export type ValuTypeProp = 'number' | 'percntage';

export const DashbordUsageCard = ({
  name,
  value,
  discription,
  isPercentage,
  percentageTrend,
}: {
  name: string;
  value: number | string;
  discription?: string;
  isPercentage?: boolean;
  hasLink?: boolean;
  percentageTrend?: 'down' | 'up';
}) => {
  if (isPercentage && value === 0) return null;

  const hasLink = Boolean((ADMIN_LINKS as any)[name as string]);

  return (
    <>
      <Card className="  text-center  max-w-sm mx-2 my-1 dark:bg-gray-700 h-full">
        <h5 className="font-semibold text-gray-500 dark:text-gray-400">{i18next.t(name)}</h5>
        <p
          className={`text-3xl font-bold tracking-tight text-gray-900 dark:text-white ${percentageTrend === 'down' ? 'text-red-500' : percentageTrend === 'up' ? 'text-green-400' : null}`}
        >
          {value}
          {isPercentage && <span>%</span>}
        </p>

        {!isPercentage && hasLink && value === 0 ? (
          <Link
            className=" text-sm  text-blue-400 hover:text-gray-700"
            href={(ADMIN_LINKS as any)[name as string].link}
          >
            Add {i18next.t(name) + ' '}
            &rarr;
          </Link>
        ) : (
          <span></span>
        )}
        {discription && !isPercentage && <p className=" text-sm  text-gray-400 hover:text-gray-700">{discription}</p>}
        {percentageTrend && (
          <p
            className={`text-sm  text-gray-400 hover:text-gray-700 ${percentageTrend === 'down' ? 'text-red-500' : 'text-green-500'}`}
          >
            {i18next.t(name)} are {percentageTrend === 'down' ? 'down ↓' : 'up ↑'}
          </p>
        )}
      </Card>
    </>
  );
};
