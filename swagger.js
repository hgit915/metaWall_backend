const swaggerAutogen = require('swagger-autogen')()
const dotenv = require('dotenv')

require('dotenv').config()
dotenv.config({ path: './.env' })

const doc = {
  info: {
    title: 'Meta API',
    description: '後端 API 文件'
  },
  host: process.env.SWAGGER_HOST,
  schema: ['http', 'https']
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./server.js']

swaggerAutogen(outputFile, endpointsFiles, doc)
