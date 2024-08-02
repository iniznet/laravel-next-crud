export const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) {
        return 'N/A';
    }
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'IDR'
    });
};
