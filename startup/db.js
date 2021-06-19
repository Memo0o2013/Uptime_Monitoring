const mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect(process.env.DB)
    .then(() => console.log('Connected to MongoDB...'));
}