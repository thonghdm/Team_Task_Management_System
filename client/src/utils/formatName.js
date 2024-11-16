export const formatName = (name) => {
    // Kiểm tra độ dài chuỗi, nếu <= 15 thì trả về chuỗi gốc
    if (name.length <= 15) return name;
    // Tách tên thành mảng các từ
    const parts = name.trim().split(' ');
    if (parts.length < 3) return name; // Không xử lý nếu không có tên đệm

    const firstName = parts[0]; // Họ
    const lastName = parts[parts.length - 1]; // Tên chính
    const middleNames = parts.slice(1, parts.length - 1); // Các tên đệm

    const formattedMiddleNames = middleNames.map(name => name.charAt(0) + '.');

    // Ghép lại thành chuỗi hoàn chỉnh
    return `${firstName} ${formattedMiddleNames.join(' ')} ${lastName}`;
}
