const AWS = require('aws-sdk')
const defaultProducts = require('./productsSeed')

const getProducts = async (req) => {
    console.log(req)
    const productIds = req.productIds || []
    const params = {
        TableName: process.env.productsTableName,
    }
    const docClient = new AWS.DynamoDB.DocumentClient({
        region: 'eu-central-1',
    })
    const products = await docClient.scan(params)
        .promise()
        .then((data) => data.Items)
        .catch((err) => {
            console.log('Error fetching products from db', err)
            throw Error('Error fetching products from db')
        })

    if (productIds.length) {
        return products.filter(({ productId }) => productIds.includes(productId))
    }
    return products
}

const seedProducts = async () => {
    const docClient = new AWS.DynamoDB.DocumentClient({
        region: 'eu-central-1',
    })
    for (let i = 0; i < defaultProducts.length; i++) {
        const element = defaultProducts[i]
        const params = {
            TableName: process.env.productsTableName,
            Item: element,
        }
        await docClient.put(params)
            .promise()
            .then((data) => data)
            .catch((err) => {
                console.log('Error adding products from db', err)
                throw Error('Error adding products from db')
            })
    }
}

module.exports = {
    getProducts,
    seedProducts,
}
