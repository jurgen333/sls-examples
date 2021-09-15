/* eslint-disable camelcase */
const AWS = require('aws-sdk')
const { v1: uuidv1 } = require('uuid')
const PdfPrinter = require('pdfmake')
const path = require('path')

const {
    userInvoiceTemplate,
} = require('./pdfTemplate')

const getPDFBuffer = (doc) => new Promise((resolve) => {
    const chunks = []

    doc.on('data', (chunk) => {
        chunks.push(chunk)
    })
    doc.on('end',
        () => resolve(Buffer.concat(chunks)))

    doc.end()
})

const generatePdf = async (ordersData) => {
    const fontDescriptors = {
        Roboto: {
            normal: path.join(__dirname, '..', '/fonts/Roboto-Regular.ttf'),
            bold: path.join(__dirname, '..', '/fonts/Roboto-Medium.ttf'),
            italics: path.join(__dirname, '..', '/fonts/Roboto-Italic.ttf'),
            bolditalics: path.join(__dirname, '..', '/fonts/Roboto-MediumItalic.ttf'),
        },
    }

    const printer = new PdfPrinter(fontDescriptors)
    const doc = printer.createPdfKitDocument(
        userInvoiceTemplate(ordersData),
    )

    return getPDFBuffer(doc).then((data) => data)
}

const uploadInvoiceToS3 = async (body, userId, orderId) => {
    const params = {
        Bucket: process.env.invoiceBucketName,
        Key: `${userId}/${orderId}.pdf`,
        Body: body,
        ContentType: 'application/pdf',
        ACL: 'public-read',
    }

    const s3 = new AWS.S3()

    console.log('uploading pdf to s3')
    return s3.putObject(params)
        .promise()
        // eslint-disable-next-line no-unused-vars
        .then((data) => {
            const itemUrl = `https://${params.Bucket}.s3.${s3.config.region}.amazonaws.com/${params.Key}`
            console.log(params)
            return itemUrl
        })
        .catch((err) => {
            console.log('Error uploading Invoice to s3', err)
            console.log(params)
            throw Error('Error uploading Invoice to s3')
        })
}

const createInvoice = async (
    user,
    ordersData,
    pdfLink,
) => {
    const invoiceId = `inv_${uuidv1()}`

    const params = {
        TableName: process.env.invoicesTableName,
        Item: {
            invoiceId,
            userId: user.userId,
            pdfLink,
            orderId: ordersData.orderId,
            date: ordersData.date,
            status: 'NOT PAID',
        },
    }
    const docClient = new AWS.DynamoDB.DocumentClient()
    console.log('creating invoice in dynamo')
    return docClient.put(params)
        .promise()
        .then((data) => data)
        .catch((err) => {
            console.log('Error creating invoice', err)
            console.log('params', params)
            throw Error(`Invoice not created for user ${user.userId}`)
        })
}

module.exports = {
    generatePdf,
    createInvoice,
    uploadInvoiceToS3,
}
