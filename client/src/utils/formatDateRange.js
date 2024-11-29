export const formatDateRange = (startDate, endDate) => {
  const optionsDay = { day: 'numeric' }; // Chỉ lấy ngày
  const optionsMonthDay = { month: 'short', day: 'numeric' }; // Lấy tháng và ngày
  const optionsFullDate = { year: 'numeric', month: 'short', day: 'numeric' }; // Lấy đầy đủ

  const start = new Date(startDate);
  const end = new Date(endDate);

  const formattedStartDay = start.toLocaleDateString('en-US', optionsDay);
  const formattedStartMonthDay = start.toLocaleDateString('en-US', optionsMonthDay);
  const formattedEndMonthDay = end.toLocaleDateString('en-US', optionsMonthDay);
  const formattedStartFullDate = start.toLocaleDateString('en-US', optionsFullDate);
  const formattedEndFullDate = end.toLocaleDateString('en-US', optionsFullDate);

  if (formattedStartFullDate === formattedEndFullDate) {
      // Ngày hoàn toàn giống nhau
      return formattedStartMonthDay;
  } else if (start.getFullYear() === end.getFullYear()) {
      // Cùng năm
      if (start.getMonth() === end.getMonth()) {
          // Cùng tháng, cùng năm
          return `${formattedStartDay} – ${formattedEndMonthDay}`;
      }
      // Khác tháng, cùng năm
      return `${formattedStartMonthDay} – ${formattedEndMonthDay}`;
  }
  // Khác năm
  return `${formattedStartFullDate} – ${formattedEndFullDate}`;
};

// // Sử dụng
// const startDate = "2024-11-08T07:33:03.585Z";
// const endDate = "2024-11-30T07:33:03.585Z";

// console.log(formatDateRange(startDate, endDate)); // Output: "8 – Nov 30"
