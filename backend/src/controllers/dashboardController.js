const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

exports.getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const { start = startDate, end = endDate } = req.query;

        const transactions = await Transaction.find({
            user: userId,
            date: {
                $gte: new Date(start),
                $lte: new Date(end)
            }
        });

        let totalIncome = 0;
        let totalExpense = 0;
        const categoryTotals = {};

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else {
                totalExpense += transaction.amount;
            }

            if (!categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] = { income: 0, expense: 0 };
            }

            if (transaction.type === 'income') {
                categoryTotals[transaction.category].income += transaction.amount;
            } else {
                categoryTotals[transaction.category].expense += transaction.amount;
            }
        });

        const netBalance = totalIncome - totalExpense;

        const recentActivity = await Transaction.find({ user: userId })
            .sort('-date')
            .limit(5);

        
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const monthlyTrends = await Transaction.aggregate([
            {
                $match: {
                    user: mongoose.Types.ObjectId.createFromHexString(userId),
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        type: '$type'
                    },
                    total: { $sum: '$amount' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        const formattedTrends = {};
        monthlyTrends.forEach(trend => {
            const key = `${trend._id.year}-${trend._id.month}`;
            if (!formattedTrends[key]) {
                formattedTrends[key] = { month: key, income: 0, expense: 0 };
            }
            formattedTrends[key][trend._id.type] = trend.total;
        });

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalIncome,
                    totalExpense,
                    netBalance,
                    totalTransactions: transactions.length
                },
                categoryBreakdown: categoryTotals,
                recentActivity,
                monthlyTrends: Object.values(formattedTrends)
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};


exports.getCategorySummary = async (req, res) => {
    try {
        const userId = req.user.id;

        const categorySummary = await Transaction.aggregate([
            {
                $match: { user: mongoose.Types.ObjectId.createFromHexString(userId) }
            },
            {
                $group: {
                    _id: {
                        category: '$category',
                        type: '$type'
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.category': 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: categorySummary
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};