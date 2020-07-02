async function triggerStream(event, context) {
  console.log("trigger stream was called...");
  const eventData = event.Records[0];
  console.log(eventData.dynamodb.NewImage)
}

export const handler = triggerStream;
