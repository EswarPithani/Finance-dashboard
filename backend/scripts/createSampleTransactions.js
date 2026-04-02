const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const transactionSchema = new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    amount: Number,
    type: String,
    category: String,
    date: Date,
    description: String
});

const userSchema = new mongoose.Schema({
    email: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);
const User = mongoose.model('User', userSchema);

const sampleTransactions = [
    { type: "income", category: "salary", amount: 5000, description: "Monthly salary" },
    { type: "income", category: "investment", amount: 1000, description: "Stock dividends" },
    { type: "income", category: "other", amount: 500, description: "Freelance work" },
    { type: "income", category: "salary", amount: 5200, description: "Bonus month" },
    { type: "income", category: "investment", amount: 750, description: "Crypto profit" },


    { type: "expense", category: "food", amount: 450, description: "Groceries" },
    { type: "expense", category: "food", amount: 85, description: "Restaurant dinner" },
    { type: "expense", category: "transport", amount: 120, description: "Fuel" },
    { type: "expense", category: "transport", amount: 300, description: "Car maintenance" },
    { type: "expense", category: "utilities", amount: 200, description: "Electricity bill" },
    { type: "expense", category: "utilities", amount: 150, description: "Water bill" },
    { type: "expense", category: "utilities", amount: 80, description: "Internet" },
    { type: "expense", category: "entertainment", amount: 50, description: "Netflix" },
    { type: "expense", category: "entertainment", amount: 120, description: "Movie tickets" },
    { type: "expense", category: "entertainment", amount: 60, description: "Gaming subscription" },
    { type: "expense", category: "food", amount: 200, description: "Weekly groceries" },
    { type: "expense", category: "transport", amount: 45, description: "Uber rides" },
    { type: "expense", category: "utilities", amount: 100, description: "Phone bill" },
    { type: "expense", category: "entertainment", amount: 200, description: "Concert tickets" },
    { type: "expense", category: "food", amount: 150, description: "Coffee shops" }
];

const createSampleTransactions = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');


        const users = await User.find({});
        console.log(`Found ${users.length} users`);

        await Transaction.deleteMany({});
        console.log('Cleared existing transactions');

        for (const user of users) {
            const transactions = [];
            const startDate = new Date('2026-01-01');
            const endDate = new Date('2026-03-31');

            for (let i = 0; i < sampleTransactions.length; i++) {
                const sample = sampleTransactions[i];
                const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

                transactions.push({
                    user: user._id,
                    amount: sample.amount,
                    type: sample.type,
                    category: sample.category,
                    date: randomDate,
                    description: sample.description
                });
            }

            await Transaction.insertMany(transactions);
            console.log(`✅ Created ${transactions.length} transactions for ${user.email}`);
        }

        console.log('\n🎉 Sample transactions created successfully!');


        const stats = await Transaction.aggregate([
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('\n📊 Transaction Summary:');
        stats.forEach(stat => {
            console.log(`${stat._id}: $${stat.total} (${stat.count} transactions)`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

createSampleTransactions();