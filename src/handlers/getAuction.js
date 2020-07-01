import AWS from "aws-sdk";
import createError from "http-errors";

import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}


export async function getAuctionById(id) {
  let auction;
  try {
    const result = await dynamodb.get({ TableName: process.env.DYNAMODB_TABLE, Key: { id } }).promise();
    auction = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if(!auction) throw new createError.NotFound(`Auction with ID ${id} not found!`)

  return auction;
}

export const handler = commonMiddleware(getAuction);