export const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes === 0) return '0 Bytes';
    
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let size = sizeInBytes;
    let unitIndex = 0;

    // Convert to the appropriate unit
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    // Return the formatted size, rounding to 2 decimal places
    return `${size.toFixed(2)} ${units[unitIndex]}`;
};
