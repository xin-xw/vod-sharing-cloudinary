/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const cloudinarysignature = /* GraphQL */ `
  query Cloudinarysignature($msg: String) {
    cloudinarysignature(msg: $msg)
  }
`;
export const getVideo = /* GraphQL */ `
  query GetVideo($id: ID!) {
    getVideo(id: $id) {
      id
      name
      description
      cloudinary
      createdAt
      updatedAt
    }
  }
`;
export const listVideos = /* GraphQL */ `
  query ListVideos(
    $filter: ModelVideoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVideos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        cloudinary
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
