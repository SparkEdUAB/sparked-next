export const getFileUrl = (url: string) => {
    if (url?.includes('uploads')) {
        return `/${url.replace(/^\/+/, '')}`;
    }
    return url;
};