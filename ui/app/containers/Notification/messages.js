/*
 * NotFoundPage Messages
 *
 * This contains all the text for the NotFoundPage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'notification.containers';

export default defineMessages({
  Cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Đóng',
  },
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Thông báo',
  },
  time: {
    id: `${scope}.time`,
    defaultMessage: 'Thời gian',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Tiêu đề',
  },
  content: {
    id: `${scope}.content`,
    defaultMessage: 'Nội dung thông báo',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'Trạng thái',
  },
});
