import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime);

// Hàm format thời gian theo phong cách Facebook
export const FormatterTimeAgo = (inputTime) => {
  const now = dayjs();
  const time = dayjs(inputTime);
  
  // Tính khoảng thời gian
  const minutesDiff = now.diff(time, 'minute');
  const hoursDiff = now.diff(time, 'hour');
  const daysDiff = now.diff(time, 'day');

  // Quy tắc format
  if (minutesDiff < 60) {
    return `${minutesDiff} minute `;
  } else if (hoursDiff < 24) {
    return `${hoursDiff} hour`;
  } else if (daysDiff < 7) {
    return `${daysDiff} day`;
  } else {
    // Nếu quá 7 ngày, format lại theo ngày cụ thể
    return time.format('DD/MM/YYYY');
  }
};
