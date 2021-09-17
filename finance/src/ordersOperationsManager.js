const { sendMessage, getUserProfile } = require('./helper')

exports.handler = async (event, context) => {
    console.log('Event:', JSON.stringify(event, null, 2))
    console.log('Context:', JSON.stringify(context, null, 2))

    const { eventName } = event.Records[0]

    const orderId = event.Records[0].dynamodb.Keys.orderId.S
    if (eventName === 'INSERT') {
        const { NewImage } = event.Records[0].dynamodb
        const userId = NewImage.userId.S
        const totalAmount = parseFloat(NewImage.totalAmount.N)
        const date = NewImage.date.S
        const contactEmail = NewImage.contactEmail.S
        const address = NewImage.address.S
        const products = NewImage.products.L
        const userProfile = await getUserProfile(userId)
        const order = {
            orderId,
            contactEmail,
            userId,
            date,
            address,
            products: products.map((product) => ({
                productTitle: product.M.productTitle.S,
                quantity: product.M.quantity.N,
                productId: product.M.productId.S,
                price: product.M.price.N,
            })),
            totalAmount,
        }
        await sendMessage(order, userProfile, totalAmount)
    }
    context.done()
    return 0
}
