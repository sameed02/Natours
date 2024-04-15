const { Tour } = require("./../../models/tourModels/tourSchema");

/* 
 In this below code, we're grabbing filtering information from `req.query`. Initially, it might seem easy to just plug this info into `Tour.find(req.query)`. But there's a hitch: if we want to do things like sorting or limiting results, we can't because `Tour.find(req.query)` will treat those parameters as part of the filter. Instead, we need to separate out these extra features and handle them individually.

 alternate way of doing exluding page,sort etc...

  const queryObj = {...req.query}
  const excludeQueries = ["page", "sort", "limit", "fields"];
  for (const key of excludeQueries) {
    delete queryObj[key];
  } 
 */

async function getAllTours(req, res) {
  try {
    // 1. filtering
    const { page, sort, limit, fields, ...queryObj } = req.query;

    // 2. advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 3. Sorting
    if (sort) {
      const sortBy = sort.split(",").join(" ");
      query.sort(sortBy);
    } else {
      query.sort("_id");
    }

    // 4. field limiting
    if (fields) {
      const selectedFields = fields.split(",").join(" ");
      console.log(selectedFields);
      query.select(selectedFields);
    } else {
      query.select("-__v");
    }

    // pagination
    const myPage = page * 1 || 1;
    const myLimit = limit * 1 || 10;
    const skip = (myPage - 1) * myLimit;

    query.skip(skip).limit(myLimit);

    if (page) {
      const numTours = await Tour.countDocuments(query);
      if (!numTours) throw new Error("this page does not exist");
    }

    // executing query and sending response
    const tours = await query;
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: { tours: tours },
    });
  } catch (err) {
    res.status(500).send({
      status: "fail",
      message: "Error reading file or parsing JSON",
    });
  }
}

module.exports = { getAllTours };
