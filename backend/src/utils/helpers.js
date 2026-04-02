exports.formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
};


exports.formatDate = (date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    if (format === 'YYYY-MM-DD') {
        return `${year}-${month}-${day}`;
    } else if (format === 'MM/DD/YYYY') {
        return `${month}/${day}/${year}`;
    } else if (format === 'DD/MM/YYYY') {
        return `${day}/${month}/${year}`;
    }
    return `${year}-${month}-${day}`;
};


exports.calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(2);
};

exports.groupByMonth = (transactions) => {
    const grouped = {};

    transactions.forEach(transaction => {
        const month = new Date(transaction.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!grouped[month]) {
            grouped[month] = { income: 0, expense: 0, transactions: [] };
        }

        if (transaction.type === 'income') {
            grouped[month].income += transaction.amount;
        } else {
            grouped[month].expense += transaction.amount;
        }
        grouped[month].transactions.push(transaction);
    });

    return grouped;
};

exports.filterByDateRange = (transactions, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= start && transactionDate <= end;
    });
};