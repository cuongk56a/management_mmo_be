export enum PeriodType {
  'TODAY' = 'TODAY',
  'THIS_WEEK' = 'THIS_WEEK',
  'THIS_MONTH' = 'THIS_MONTH',
  'ALL' = 'ALL',
}

export const getTimePeriod = (periodType?: PeriodType) => {
  const times = {
    [PeriodType.ALL]: undefined,
    [PeriodType.TODAY]: new Date(Date.now() - 60 * 60 * 24 * 1000),
    [PeriodType.THIS_WEEK]: new Date(Date.now() - 60 * 60 * 24 * 7 * 1000),
    [PeriodType.THIS_MONTH]: new Date(Date.now() - 60 * 60 * 24 * 30 * 1000),
  };
  return !periodType ? undefined : times[periodType];
};
