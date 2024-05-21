class APIFeatures {
  constructor(model, queryObj) {
    this.model = model;
    this.queryObj = queryObj;
    this.query;
  }

  // 1. filtering
  filter() {
    const { page, sort, limit, fields, ...queryObj } = this.queryObj;

    // 2. advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.model.find(JSON.parse(queryStr));
    return this;
  }

  //sorting
  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("_id");
    }
    return this;
  }

  //field limiting
  fields() {
    if (this.queryObj.fields) {
      const selectedFields = this.queryObj.fields.split(",").join(" ");
      this.query = this.query.select(selectedFields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  // pagination
  async pagination() {
    const myPage = this.queryObj.page * 1 || 1;
    const myLimit = this.queryObj.limit * 1 || 10;
    const skip = (myPage - 1) * myLimit;

    this.query = this.query.skip(skip).limit(myLimit);

    if (this.queryObj.page) {
      const numTours = await this.model.countDocuments(this.query);
      if (!numTours) {
        throw new Error("this page does not exist");
      }
    }
    return this;
  }
}

module.exports = { APIFeatures };
