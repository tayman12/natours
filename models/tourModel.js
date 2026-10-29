const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'A tour must have a name'],
      maxLength: [40, 'A tour name must have at most 40 characters'],
      minLength: [10, 'A tour name must have at least 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: { type: String, unique: true, trim: true },
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, mediun, or difficult',
      },
    },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          console.log(`price discount: ${val}, price ${this.price}`);
          return val < this.price;
        },
        message: 'Price discount ({VALUE}) must be less than price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image cover'],
    },
    images: [String],
    createdAt: { type: Date, default: Date.now(), select: false },
    startDates: [Date],
    secret: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObjects: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

tourSchema.pre(/^find/, function () {
  this.find({ secret: { $ne: true } });
  this.start = new Date();
});

tourSchema.post(/^find/, function (docs) {
  console.log(new Date() - this.start);
});

tourSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
});

module.exports = mongoose.model('Tour', tourSchema);
