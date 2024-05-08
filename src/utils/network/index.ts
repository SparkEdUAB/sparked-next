import { T_Record } from 'types/navigation';

const NETWORK_UTILS = {
  formatGetParams: (params: T_Record) => '?' + new URLSearchParams(params).toString(),
};

export default NETWORK_UTILS;
