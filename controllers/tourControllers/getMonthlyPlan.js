const { Tour } = require("./../../models/tourModels/tourSchema");
const { AppError } = require("./../../utils/appError");

async function getMonthlyPlan(req, res, next) {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            $month: "$startDates",
          },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { numTourStarts: -1 },
      },
    ]);

    res.status(200).json({
      status: "success",
      results: plan.length,
      data: { plan },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
}

module.exports = { getMonthlyPlan };
