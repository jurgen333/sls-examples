const userHasEnoughBudget = (userBudget, orderTotalAmount) => {
    if (orderTotalAmount > userBudget) {
        return false
    }
    return true
}

module.exports = {
    userHasEnoughBudget,
}
