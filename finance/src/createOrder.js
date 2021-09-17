const {
    createOrder,
    getUserProfile,
    getProducts,
    updateUserBudget,
    sendMessage,
} = require('./helper')

const {
    userHasEnoughBudget,
} = require('./validations')

module.exports.handler = async (event) => {
    // await seedUserProfiles()
    const userProfile = await getUserProfile(event.body.userId)
    const products = await getProducts(event.body)

    const productsWithQuantityAdded = products.map((product) => ({
        ...product,
        quantity: event.body.products.find((prod) => prod.productId === product.productId).quantity,
    }))

    const orderTotal = productsWithQuantityAdded.reduce(
        (acc, curr) => acc + (curr.quantity * curr.price), 0,
    )
    const enoughBudget = userHasEnoughBudget(userProfile.budget, orderTotal)

    if (!enoughBudget) {
        throw Error('Not enough budget')
    }

    await updateUserBudget(userProfile.userId, userProfile.budget - orderTotal)

    const order = await createOrder(userProfile, productsWithQuantityAdded, orderTotal)

    if (!order) {
        await updateUserBudget(userProfile.userId, userProfile.budget)
    }

    return order
}
