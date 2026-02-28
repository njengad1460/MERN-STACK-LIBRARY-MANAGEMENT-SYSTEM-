const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  type: {
    type: String,
    enum: ['issue', 'return'],
    required: true
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  issuedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date
  },
  returnedAt: {
    type: Date
  },
  isOverdue: {
    type: Boolean,
    default: false
  },
  fineAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  finePaid: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

// Check if transaction is overdue
transactionSchema.methods.checkOverdue = function() {
  if (this.dueDate && this.status === 'approved' && !this.returnedAt) {
    this.isOverdue = new Date() > this.dueDate;
    if (this.isOverdue) {
      const daysOverdue = Math.ceil((new Date() - this.dueDate) / (1000 * 60 * 60 * 24)); // milliseconds_per_day
      this.fineAmount = daysOverdue * 20; // sh.20 per day
    }
  }
  return this.save();
};

module.exports = mongoose.model('Transaction', transactionSchema); 