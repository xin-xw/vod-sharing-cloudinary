/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const cloudinary = require("cloudinary").v2;
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

exports.handler = async (event) => {
  console.log(event);

  const response = {
    statusCode: 400,
    body: `Missing Cloudinary ENV Variables`,
  };
  if (!api_secret || !api_key || !cloud_name) {
    return response;
  }

  console.log(`Params for signature`);
  const signature = await cloudinary.utils.api_sign_request(
    JSON.parse(event.arguments.msg),
    api_secret
  );

  response.body = signature;
  return JSON.stringify(response);
};
