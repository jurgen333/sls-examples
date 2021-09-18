const {
    getUserProfile,
    seedUserProfiles,
} = require('./helper')

module.exports.handler = async (event) => {
    // await seedUserProfiles()
    const user = await getUserProfile(event.query)

    return user
}
