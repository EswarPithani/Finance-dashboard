const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    status: String
});

const User = mongoose.model('User', userSchema);

const dummyUsers = [
    {
        name: "Admin User",
        email: "admin@demo.com",
        password: "admin123",
        role: "admin",
        status: "active"
    },
    {
        name: "Analyst User",
        email: "analyst@demo.com",
        password: "analyst123",
        role: "analyst",
        status: "active"
    },
    {
        name: "Viewer User",
        email: "viewer@demo.com",
        password: "viewer123",
        role: "viewer",
        status: "active"
    },
    {
        name: "John Smith",
        email: "john@example.com",
        password: "password123",
        role: "analyst",
        status: "active"
    },
    {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        password: "password123",
        role: "viewer",
        status: "active"
    }
];

const createDummyUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');

        await User.deleteMany({});
        console.log('Cleared existing users');

        for (const user of dummyUsers) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const newUser = new User({
                ...user,
                password: hashedPassword
            });
            await newUser.save();
            console.log(`✅ Created user: ${user.email} (${user.role})`);
        }

        console.log('\n🎉 All dummy users created successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        dummyUsers.forEach(user => {
            console.log(`${user.role.toUpperCase()}:`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Password: ${user.password}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

createDummyUsers();