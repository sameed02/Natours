const fs = require("fs");

function readFileData(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
  return data;
}

function writeFileData(resHandler, filePath, dataToWrite, response) {
  const { statusCode, status, responseData } = response;
  fs.writeFile(filePath, JSON.stringify(dataToWrite), () => {
    resHandler.status(statusCode).send({ status, data: responseData });
  });
}

module.exports = { readFileData, writeFileData };
