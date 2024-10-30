// Giả lập database users để demo
// let existingUsernames = [
//     'thonghdm',
//     'thonghdm1',
//     'annv',
//     'binhlt'
// ]

function convertToUsername(fullname) {
    // Object ánh xạ ký tự có dấu sang không dấu
    const vietnameseMap = {
        'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
        'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
        'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
        'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
        'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
        'đ': 'd'
    }

    // Hàm chuyển đổi ký tự có dấu thành không dấu
    const removeAccents = (str) => {
        return str.toLowerCase().split('').map(char => vietnameseMap[char] || char).join('')
    }

    // Chuyển chuỗi thành chữ thường và tách thành mảng các từ
    const words = fullname.toLowerCase().trim().split(/\s+/)
    // Lấy tên (từ cuối cùng)
    const lastName = removeAccents(words[words.length - 1])
    // Lấy chữ cái đầu của họ và tên đệm
    const initials = words.slice(0, -1)
        .map(word => removeAccents(word.charAt(0)))
        .join('')
    return lastName + initials
}

export function generateUniqueUsername(fullname, usernameData) {
    // Tạo username cơ bản
    let baseUsername = convertToUsername(fullname)
    let username = baseUsername
    let counter = 1
    while (usernameData.includes(username)) {
        username = baseUsername + counter
        counter++
    }
    usernameData.push(username)
    return username
}

// // Test function
// console.log(generateUniqueUsername("Hoàng Đình Minh Thông", existingUsernames))
// console.log(generateUniqueUsername("Hoàng Đình Minh Thông", existingUsernames))
// console.log(generateUniqueUsername("Nguyễn Văn An", existingUsernames))

