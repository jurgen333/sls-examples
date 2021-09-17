const {
    getProducts,
    seedProducts,
} = require('./helper')

module.exports.handler = async (event) => {
    // await seedProducts()
    const products = await getProducts(event.query)

    return products
}

// Use this code if you don't use the http event with the LAMBDA-PROXY integration
// return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
