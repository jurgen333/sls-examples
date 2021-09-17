const {
    updateUserBudget,
} = require('./helper')

module.exports.handler = async (event) => {
    const updated = await updateUserBudget(
        event.body.userId, event.body.newBudget,
    )

    return updated
}
