const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json()); // For parsing application/json
require('dotenv').config();

const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:3000/*', 
    'https://how2split.netlify.app', 
    'https://how2split.netlify.app/*', 
    'https://how2split.derekdylu.com',
    'https://how2split.derekdylu.com/*',
  ], // or an array of valid origins
  optionsSuccessStatus: 200
};

app.use(cors());

const mongoose = require('mongoose');

// Replace 'your_database_url' with the actual database URL.
// If running locally, it's typically mongodb://localhost:27017/yourdbname
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  eventId: { type: String, required: true },
  timestamp: { type: Number, required: true },
  type: { type: String, required: true },
  value: { type: Number, required: true },
  payer: { type: String, required: true },
  receiver: { type: String }, // Optional, based on type
  name: { type: String }, // Optional, based on type
  method: { type: Number }, // Optional, based on type
  shares: {
    type: Map,
    of: Number,
    default: {}
  } // Using a Map for dynamic keys with Number values
});

const EventSchema = new Schema({
  name: { type: String, required: true },
  accounts: [{ type: String, required: true }],
  locked: { type: Boolean, default: false },
  password: String  // Consider hashing this
});

const Transaction = mongoose.model('Transaction', TransactionSchema, 'transactions');
const Event = mongoose.model('Event', EventSchema, 'events');

app.get('/', (req, res) => {
  res.send('Server connected!');
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT || 8000}`);
});

app.get('/events/:id', (req, res) => {
  Event.findOne({ _id: req.params.id })
    .then(event => {
      if (!event) return res.status(404).send('Event not found.');
      res.send(event);
    })
    .catch(err => res.status(500).send('Server error'));
});

// find a specific transition with its _id
app.get('/transactions/:id', (req, res) => {
  Transaction.findOne({ _id: req.params.id })
    .then(transaction => {
      if (!transaction) return res.status(404).send('Transaction not found.');
      res.send(transaction);
    })
    .catch(err => res.status(500).send('Server error'));
});

// find transactions that belong to a certain event with eventID
app.get('/events/:eventId/transactions', (req, res) => {
  Transaction.find({ eventId: req.params.eventId })
    .then(transactions => {
      if (transactions.length === 0) return res.status(404).send('No transactions found for this event.');
      res.send(transactions);
    })
    .catch(err => res.status(500).send('Server error'));
});

app.post('/events', (req, res) => {
  const newEvent = new Event({
    name: req.body.name,
    accounts: req.body.accounts, // assuming this is an array of strings
    locked: req.body.locked,
    password: req.body.password // remember to hash passwords in real applications
  });

  newEvent.save()
    .then(event => res.status(201).send(event))
    .catch(err => res.status(500).send('Server error'));
});

app.post('/transactions', (req, res) => {
  const newTransaction = new Transaction({
    eventId: req.body.eventId,
    timestamp: req.body.timestamp,
    type: req.body.type,
    value: req.body.value,
    payer: req.body.payer,
    receiver: req.body.receiver, // optional
    name: req.body.name, // optional
    method: req.body.method, // optional
    shares: req.body.shares // ensure this aligns with the expected structure
  });

  newTransaction.save()
    .then(transaction => res.status(201).send(transaction))
    .catch(err => res.status(500).send('Server error'));
});

app.patch('/transactions/:id', (req, res) => {
  const updates = req.body; // assuming the body contains the fields to update
  const options = { new: true }; // to return the updated document

  Transaction.findByIdAndUpdate(req.params.id, updates, options)
    .then(transaction => {
      if (!transaction) {
        return res.status(404).send('Transaction not found.');
      }
      res.send(transaction);
    })
    .catch(err => res.status(500).send('Server error'));
});

app.delete('/transactions/:id', (req, res) => {
  Transaction.findByIdAndDelete(req.params.id)
    .then(transaction => {
      if (!transaction) {
        return res.status(404).send('Transaction not found.');
      }
      res.send({ message: 'Transaction successfully deleted', transaction });
    })
    .catch(err => {
      // If the error is due to an invalid ObjectId format
      if (err.kind === 'ObjectId') {
        return res.status(400).send('Invalid ID format');
      }
      res.status(500).send('Server error');
    });
});
