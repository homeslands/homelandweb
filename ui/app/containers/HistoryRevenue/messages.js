/*
 * NotFoundPage Messages
 *
 * This contains all the text for the NotFoundPage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'historyRevenue.containers';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Lịch sử doanh thu',
  },
  time: {
    id: `${scope}.time`,
    defaultMessage: 'Thời gian',
  },
  amount: {
    id: `${scope}.amount`,
    defaultMessage: 'Số tiền (VNĐ)',
  },
  currentAmount: {
    id: `${scope}.currentAmount`,
    defaultMessage: 'Số dư còn lại (VNĐ)',
  },
  type: {
    id: `${scope}.type`,
    defaultMessage: 'Loại',
  },
  nameIncome: {
    id: `${scope}.nameIncome`,
    defaultMessage: 'Người nhận',
  },
  accountIncome: {
    id: `${scope}.accountIncome`,
    defaultMessage: 'STK nhận',
  },
  bankName: {
    id: `${scope}.bankName`,
    defaultMessage: 'Ngân hàng',
  },
  rechargeTotal: {
    id: `${scope}.rechargeTotal`,
    defaultMessage: 'Tổng doanh thu:',
  },
  withdrawTotal: {
    id: `${scope}.withdrawTotal`,
    defaultMessage: 'Tổng rút:',
  },
});
