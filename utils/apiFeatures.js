class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObject = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'projection'];
    excludedFields.forEach((element) => delete queryObject[element]);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    queryObject = JSON.parse(queryStr);

    this.query.find(queryObject);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query.sort(this.queryString.sort.split(',').join(' '));
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }

  async pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query.skip(skip);
    this.query.limit(limit);

    return this;
  }

  projection() {
    if (this.queryString.projection) {
      this.query.select(this.queryString.projection.split(',').join(' '));
    } else {
      this.query.select('-__v');
    }

    return this;
  }
}

module.exports = APIFeatures;
