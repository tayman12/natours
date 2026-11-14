const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    tour: { type: mongoose.Schema.ObjectId, ref: 'Tour', required: [true, 'Review must belong to a tour.'] },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: [true, 'Review must belong to a user.'] },
  },
  {
    toJSON: { virtuals: true },
    toObjects: { virtuals: true },
  },
);

reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        ratingsCount: { $count: {} },
        ratingsAvg: { $avg: '$rating' },
      },
    },
  ]);

  if (stats && stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].ratingsAvg,
      ratingsQuantity: stats[0].ratingsCount,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function () {
  this.reviewDoc = await this.model.findOne(this.getQuery());
});

reviewSchema.post(/^findOneAnd/, async function () {
  if (this.reviewDoc) {
    await this.reviewDoc.constructor.calcAverageRatings(this.reviewDoc.tour._id);
  }
});

reviewSchema.pre(/^find/, function () {
  if (!this.getOptions().skipPopulation) {
    this.populate({ path: 'user', select: 'name photo' }).populate({ path: 'tour', select: 'name' });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
