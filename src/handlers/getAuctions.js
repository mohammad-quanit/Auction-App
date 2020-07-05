import AWS from "aws-sdk";
import createError from "http-errors";
import validator from "@middy/validator";

import commonMiddleware from "../lib/commonMiddleware";
import getAuctionSchema from "../lib/schemas/getAuctionsSchema";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;
  let auctions;

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ":status": status
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    }
  }

  try {
    // const result = await dynamodb.scan({ TableName: process.env.DYNAMODB_TABLE }).promise();
    const result = await dynamodb.query(params).promise();
    auctions = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions).use(validator({ inputSchema: getAuctionSchema, useDefaults: true }));
