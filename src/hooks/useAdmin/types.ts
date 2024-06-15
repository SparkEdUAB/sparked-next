export type T_RawStatsFields = {
  name: string;
  value: string | number;
  isPercentage: boolean;
  percentageTrend: 'down' | 'up';
};
export type T_StatFields = {
  index: number;
  name: string;
  value: string | number;
  isPercentage?: boolean;
  discription?: string;
  hasLink?: boolean;
  percentageTrend?: 'down' | 'up';
};
