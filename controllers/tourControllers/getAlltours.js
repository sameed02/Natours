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
  const { page, sort, limit, fields, ...queryObj } = req.query;
  /* 
Tour.find(queryObj) creates a query object.
const query = Tour.find(queryObj); stores this query object in the variable query.
await query; pauses execution and waits for the promise returned by query to resolve, which happens when the query is executed and the results are returned.
Once the promise is resolved, the result is assigned to the variable tours, allowing you to work with the data retrieved from the database.

we're doing all this to make chain other features like pagination, sorting, limits etc
  */
  try {
    const query = Tour.find(queryObj);
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
