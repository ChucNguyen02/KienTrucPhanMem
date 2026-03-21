export function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('vi-VN');
}

export function formatDateTime(value: string): string {
    return new Date(value).toLocaleString('vi-VN');
}
