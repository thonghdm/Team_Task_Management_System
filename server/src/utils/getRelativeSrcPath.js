export const getRelativeSrcPath = (fullPath) => {
    const srcIndex = fullPath.indexOf('src');
    return srcIndex !== -1 ? fullPath.substring(srcIndex).replace(/\\/g, '/') : fullPath;
};