export const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) {
        return 'N/A';
    }
    return value.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });
};
