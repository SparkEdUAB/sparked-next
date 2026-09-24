const NETWORK_UTILS = {
  formatGetParams: (params: Record<string, string | null | undefined>) =>
    '?' +
    new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== null && value !== undefined) as [string, string][],
    ).toString(),
};

export default NETWORK_UTILS;
