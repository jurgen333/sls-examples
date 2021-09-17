const AWS = require('aws-sdk')
const defaultUsers = require('./usersSeed')

const getUserProfile = async (req) => {
    const { userId } = req
    const params = {
        TableName: process.env.usersTableName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },

    }
    const docClient = new AWS.DynamoDB.DocumentClient({
        region: 'eu-central-1',
    })
    const result = await docClient.query(params)
        .promise()
        .then((data) => data)
        .catch((err) => {
            console.log(params)
            console.log('Error fetching users from db', err)
            throw Error('Error fetching users from db')
        })

    if (result.Count === 1) { return result.Items[0] }

    throw Error('User not found')
}

const seedUserProfiles = async () => {
    const docClient = new AWS.DynamoDB.DocumentClient({
        region: 'eu-central-1',
    })
    for (let i = 0; i < defaultUsers.length; i++) {
        const element = defaultUsers[i]
        const params = {
            TableName: process.env.usersTableName,
            Item: element,
        }
        await docClient.put(params)
            .promise()
            .then((data) => data)
            .catch((err) => {
                console.log('Error adding users from db', err)
                throw Error('Error adding users from db')
            })
    }
}

module.exports = {
    getUserProfile,
    seedUserProfiles,
}
