const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const companyRoutes = require('./routes/employeeRoutes');
const { PORT, MONGODB_URI } = require('./config');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB database
mongoose.set('strictQuery', true)
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});


// Routes
app.use('/com', companyRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
