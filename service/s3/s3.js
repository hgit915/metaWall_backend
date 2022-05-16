require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const region = process.env.AWS_BUCKET_REGION
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

function uploadFile (file) {
  const fileStream = fs.createReadStream(file.path)

  const params = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }

  return s3.upload(params).promise()
}

/**
 * 取得對象本身。如果存的是圖片，就取到那個圖片本身
 */
function getFileAsync (fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).promise()
}

/**
 * 取得對象的元數據而不返回對象本身
 * https://docs.aws.amazon.com/zh_cn/AWSJavaScriptSDK/latest/AWS/S3.html#headObject-property
 */
async function getFileInfo (fileKey) {
  const params = {
    Bucket: bucketName,
    Key: fileKey
  }

  // headObject function只檢索對象的元數據而不返回對象本身
  // 成功取到內容的話(該id在s3存在)，回傳格式如下
  // {
  //   AcceptRanges: 'bytes',
  //   LastModified: 2022-05-09T04:56:07.000Z,
  //   ContentLength: 11263,
  //   ETag: '"5cfb8e02f09cc089673bbfd0427xxxx"',
  //   ContentType: 'application/octet-stream',
  //   Metadata: {}
  // }
  return s3.headObject(params).promise()
}

module.exports = {
  uploadFile,
  getFileAsync,
  getFileInfo
}
