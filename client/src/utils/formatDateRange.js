export const formatDateRange = (startDate, endDate) => {
    const options = { month: 'short', day: 'numeric' }; // Định dạng tháng rút gọn và ngày
    const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', options);
    const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', options);
    if(formattedStartDate === formattedEndDate) {
      return formattedStartDate;
    }
    return `${formattedStartDate} – ${formattedEndDate}`;
};
  
  // Sử dụng
//   const startDate = "2024-11-16T07:33:03.585Z";
//   const endDate = "2024-11-16T07:33:03.585Z";
  
//   console.log(formatDateRange(startDate, endDate)); // Output: "Nov 16 – Nov 16"
  