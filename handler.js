const AWS = require('aws-sdk');

const CARS_TABLE = process.env.CARS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.saveCar = (event, context, callback) => {
  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  };

  const requestParams = event.queryStringParameters;

  const carName = requestParams.carName;
  const modelYear = requestParams.modelYear;
  const units = requestParams.units;
  console.log(`Request to save ${units} x ${carName} from ${modelYear}`);

  const params = {
    TableName: CARS_TABLE,
    Item: {
      carName,
      modelYear,
      units
    },
  }

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      response.statusCode = 400;
      response.body = JSON.stringify({ error: "Could not save car :(" })

      callback(null, response);
    }
    response.body = JSON.stringify({ carName, modelYear, units })
    callback(null, response);
  });
}

module.exports.getCar = (event, context, callback) => {
  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  };

  const carName = event.queryStringParameters.carName;
  console.log(`Request to retrieve car ${carName}`);

  const params = {
    TableName: CARS_TABLE,
    Key: {
      carName
    },
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      response.statusCode = 400;
      response.body = JSON.stringify({ error: "Could not retrieve car :(" })

      callback(null, response);
    }
    if (result.Item) {
      const { carName, modelYear, units } = result.Item;
      response.body = JSON.stringify({ carName, modelYear, units })

      callback(null, response);
    } else {
      response.statusCode = 400;
      response.body = JSON.stringify({ error: "Car does not exist" })

      callback(null, response);
    }
  });
}