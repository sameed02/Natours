const express = require("express");
const fs = require("fs");
const { dirname } = require("path");

const app = express();

app.use(express.json());

app.get("/api/v1/tours", (req, res) => {
  try {
    const data = fs.readFileSync("./dev-data/data/tours-simple.json", {
      encoding: "UTF-8",
    });
    const toursData = JSON.parse(data);
    res.status(200).json({
      status: "success",
      result: toursData.length,
      data: { tours: toursData },
    });
  } catch (err) {
    res.status(500).send({
      status: "fail",
      message: "Error reading file or parsing JSON",
    });
  }
});

app.post("/api/v1/tours", (req, res) => {
  const tours = JSON.parse(
    fs.readFileSync("./dev-data/data/tours-simple.json", {
      encoding: "UTF-8",
    })
  );

  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  fs.writeFile(
    "./dev-data/data/tours-simple.json",
    JSON.stringify(tours),
    () => {
      res.status(201).send({ status: "success", data: newTour });
    }
  );
});

app.get("/api/v1/tours/:id", (req, res) => {
  try {
    const data = fs.readFileSync("./dev-data/data/tours-simple.json", {
      encoding: "UTF-8",
    });
    const toursData = JSON.parse(data);
    const foundTour = toursData.filter(
      (tour) => tour.id === Number(req.params.id)
    );

    if (foundTour.length > 0) {
      res.status(200).json({
        status: "success",
        data: { tour: foundTour },
      });
    } else {
      const error = { status: "fail", message: "no tour found" };
      throw error;
    }
  } catch (err) {
    res.status(404).json({
      status: err.status,
      message: err.message,
    });
  }
});

app.patch("/api/v1/tours/:id", (req, res) => {
  try {
    const data = fs.readFileSync(
      `${__dirname}/dev-data/data/tours-simple.json`,
      {
        encoding: "UTF-8",
      }
    );
    const toursData = JSON.parse(data);

    console.log("Tours Data:", toursData); // Log toursData

    const foundTour = toursData.filter(
      (tour) => tour.id === Number(req.params.id)
    );

    if (foundTour.length > 0) {
      const foundTourIndex = toursData.findIndex(
        (tour) => tour.id === Number(req.params.id)
      );

      const updatedTour = { ...foundTour[0], ...req.body };
      toursData[foundTourIndex] = updatedTour;

      fs.writeFile(
        "./dev-data/data/tours-simple.json",
        JSON.stringify(toursData),
        () => {
          res.status(201).send({ status: "success", data: updatedTour });
        }
      );
    } else {
      const error = { status: "fail", message: "Tour could not be updated" };
      throw error;
    }
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
});

app.delete("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id;
  try {
    const tours = JSON.parse(
      fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, {
        encoding: "UTF-8",
      })
    );
    const updatedTour = tours.filter((tour) => tour.id !== Number(id));
    console.log(tours.length);
    fs.writeFileSync(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(updatedTour),
      () => {
        res.json({ status: "success" });
      }
    );
    res.json({ status: "success" });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
});

app.listen(3000, () => console.log(`app is listening on port 3000`));
