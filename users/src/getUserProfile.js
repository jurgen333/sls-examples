const {
    getUserProfile,
    seedUserProfiles,
} = require('./helper')

module.exports.handler = async (event) => {
    // await seedUserProfiles()
    const products = await getUserProfile(event.query)

    return products
}
