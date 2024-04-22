import { T_Record } from 'types/navigation';

const NETWORK_UTILS = {
  formatGetParams: ({ params }: { params: T_Record }) => new URLSearchParams(params),
};

export default NETWORK_UTILS;
