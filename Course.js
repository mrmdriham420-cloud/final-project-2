const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: String,
  teacher: String,
  credits: Number,
  description: String,
  enrolledStudents: {
    type: Number,
    default: 0
  },
  ratings: [
    {
      userId: String,
      star: Number
    }
  ],
  averageRating: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Course", courseSchema);