/* eslint-disable camelcase */
const AWS = require('aws-sdk')
const { v1: uuidv1 } = require('uuid')
const PdfPrinter = require('pdfmake')
const path = require('path')
const moment = require('moment')

const userInvoiceTemplate = require('./pdfTemplate')

const {
    SYNC_LAMBDA_INVOKE_TYPE,
    FUNCTION_NAMES,
} = require('./constants')

const invokeLambda = async (functionName, payload) => {
    const lambda = new AWS.Lambda({ region: 'eu-central-1' })

    const params = {
        FunctionName: functionName,
        InvocationType: SYNC_LAMBDA_INVOKE_TYPE,
        Payload: JSON.stringify(payload),
    }

    return lambda.invoke(params)
        .promise()
        .then((data) => {
            if (data.StatusCode >= 400) {
                throw new Error(`Error received while invoking lambda with status code ${data.StatusCode}`)
            }

            const receivedPayload = JSON.parse(data.Payload)

            if (receivedPayload !== null && receivedPayload.errorType === 'Error') {
                throw new Error(receivedPayload.errorMessage)
            }

            return receivedPayload
        })
}

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
    orderAmount,
) => {
    const invoiceId = `inv_${uuidv1()}`

    const params = {
        TableName: process.env.invoicesTableName,
        Item: {
            invoiceId,
            userId: user.userId,
            pdfLink,
            totalAmount: orderAmount,
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

const createOrder = async (userProfile, products, totalAmount) => {
    const order = {
        orderId: `order_${uuidv1()}`,
        date: moment().format(),
        userId: userProfile.userId,
        contactEmail: userProfile.email,
        address: userProfile.address,
        products: products.map((product) => ({
            productId: product.productId,
            price: product.price,
            productTitle: product.productTitle,
            quantity: product.quantity,
        })),
        totalAmount,
    }

    const params = {
        TableName: process.env.ordersTableName,
        Item: order,
    }

    const docClient = new AWS.DynamoDB.DocumentClient()

    return docClient.put(params)
        .promise()
        .then((data) => params.Item)
        .catch((err) => {
            console.log('Error creating order', err)
            throw Error(`Order not created for user ${userProfile.userId}`)
        })
}

const getUserProfile = async (userId) => {
    const payload = {
        query: {
            userId,
        },
    }

    return invokeLambda(FUNCTION_NAMES.GET_USER_PROFILE, payload)
        .then((data) => data)
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.log('Error when invoking get user profile from finance', error)
            console.log('Payload ', payload)

            throw new Error('Error when invoking get user profile from finance')
        })
}

const updateUserBudget = async (userId, newBudget) => {
    const payload = {
        body: {
            userId,
            newBudget,
        },
    }

    return invokeLambda(FUNCTION_NAMES.UPDATE_USER_BUDGET, payload)
        .then((data) => data)
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.log('Error when invoking remove budget from finance', error)
            console.log('Payload ', payload)

            throw new Error('Error when invoking remove budget from finance')
        })
}

const getProducts = async (req) => {
    const payload = {
        query: {
            productIds: req.products.map((product) => product.productId),
        },
    }

    return invokeLambda(FUNCTION_NAMES.GET_PRODUCTS, payload)
        .then((data) => data)
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.log('Error when invoking get products from finance', error)
            console.log('Payload ', payload)

            throw new Error('Error when invoking get products from finance')
        })
}

const sendMessage = async (order, user, totalAmount) => {
    const sqs = new AWS.SQS({
        region: 'eu-central-1',
    })

    const params = {
        MessageBody: 'Create invoice',
        MessageAttributes: {
            orderData: {
                DataType: 'String',
                StringValue: JSON.stringify(order),
            },
            user: {
                DataType: 'String',
                StringValue: JSON.stringify(user),
            },
            totalAmount: {
                DataType: 'String',
                StringValue: JSON.stringify(totalAmount),
            },
        },
        QueueUrl: process.env.invoiceQueue,
    }
    console.log(params)
    console.log('sending message')

    // eslint-disable-next-line no-await-in-loop
    await sqs.sendMessage(params)
        .promise()
        .then()
        .catch((err) => {
            console.log('params', params)
            console.log('Error sending message to queue', err)
            throw Error('Error sending message to queue')
        })
}

module.exports = {
    generatePdf,
    createInvoice,
    uploadInvoiceToS3,
    createOrder,
    getUserProfile,
    getProducts,
    updateUserBudget,
    sendMessage,
}
