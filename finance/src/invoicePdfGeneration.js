const {
    generatePdf,
    createInvoice,
    uploadInvoiceToS3,
} = require('./helper')

module.exports.handler = async (event, context, callback) => {
    console.log('Event ', JSON.stringify(event, null, 2))
    console.log('Context ', JSON.stringify(context, null, 2))
    for (let i = 0; i < event.Records.length; i++) {
        const data = event.Records[i]
        const orderData = JSON.parse(data.messageAttributes.orderData.stringValue)
        const user = JSON.parse(data.messageAttributes.user.stringValue)
        const totalAmount = parseFloat(data.messageAttributes.totalAmount.stringValue)

        console.log('order', orderData)
        console.log(user)
        console.log(totalAmount)
        // eslint-disable-next-line no-await-in-loop
        const userPdfInvoice = await generatePdf({
            user,
            orderData,
            totalAmount,
        })

        // eslint-disable-next-line no-await-in-loop
        const userPdfInvoiceLink = await uploadInvoiceToS3(
            userPdfInvoice,
            user.userId,
            orderData.orderId,
        )

        // eslint-disable-next-line no-await-in-loop
        await createInvoice(
            user,
            orderData,
            userPdfInvoiceLink,
            totalAmount,
        )
    }
    callback(null)
}
