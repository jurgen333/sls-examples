const moment = require('moment')
// Supplier invoice to be shown to supplier
const userInvoice = ({
    user,
    orderData,
    totalAmount,
}) => ({
    content: [
        {
            columns: [
                [
                    {
                        text: 'Invoice',
                        color: '#333333',
                        width: '*',
                        fontSize: 28,
                        bold: true,
                        alignment: 'right',
                        margin: [0, 0, 0, 15],
                    },
                    {
                        stack: [
                            {
                                columns: [
                                    {
                                        text: 'Invoice No.',
                                        color: '#aaaaab',
                                        bold: true,
                                        width: '*',
                                        fontSize: 12,
                                        alignment: 'right',
                                    },
                                    {
                                        text: '00001',
                                        bold: true,
                                        color: '#333333',
                                        fontSize: 12,
                                        alignment: 'right',
                                        width: 100,
                                    },
                                ],
                            },
                            {
                                columns: [
                                    {
                                        text: 'Date Issued',
                                        color: '#aaaaab',
                                        bold: true,
                                        width: '*',
                                        fontSize: 12,
                                        alignment: 'right',
                                    },
                                    {
                                        text: moment().format('YYYY-MM-DD'),
                                        bold: true,
                                        color: '#333333',
                                        fontSize: 12,
                                        alignment: 'right',
                                        width: 100,
                                    },
                                ],
                            },
                            {
                                columns: [
                                    {
                                        text: 'Due Date',
                                        color: '#aaaaab',
                                        bold: true,
                                        width: '*',
                                        fontSize: 12,
                                        alignment: 'right',
                                    },
                                    {
                                        text: 'IMMEDIATE',
                                        bold: true,
                                        color: '#333333',
                                        fontSize: 12,
                                        alignment: 'right',
                                        width: 100,
                                    },
                                ],
                            },
                            {
                                columns: [
                                    {
                                        text: 'Status',
                                        color: '#aaaaab',
                                        bold: true,
                                        fontSize: 12,
                                        alignment: 'right',
                                        width: '*',
                                    },
                                    {
                                        text: 'NOT PAID',
                                        bold: true,
                                        fontSize: 14,
                                        alignment: 'right',
                                        color: 'green',
                                        width: 100,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            ],
        },
        {
            columns: [
                {
                    text: 'From',
                    color: '#aaaaab',
                    bold: true,
                    fontSize: 14,
                    alignment: 'left',
                    margin: [0, 20, 0, 5],
                },
                {
                    text: 'To',
                    color: '#aaaaab',
                    bold: true,
                    fontSize: 14,
                    alignment: 'right',
                    margin: [0, 20, 0, 5],
                },
            ],
        },
        {
            columns: [
                {
                    text: 'Our Platform name',
                    bold: true,
                    color: '#333333',
                    alignment: 'left',
                },
                {
                    alignment: 'right',
                    text: user.firstName,
                    bold: true,
                    color: '#333333',
                },
            ],
        },
        {
            columns: [
                {
                    text: 'Address',
                    color: '#aaaaab',
                    bold: true,
                    margin: [0, 7, 0, 3],
                },
                {
                    alignment: 'right',
                    text: 'Address',
                    color: '#aaaaab',
                    bold: true,
                    margin: [0, 7, 0, 3],
                },
            ],
        },
        {
            columns: [
                {
                    text: '9999 Street name 1A \n New-York City NY 00000 \n   USA \n VAT number: GB xx \n PO Number: xxxx',
                    style: 'invoiceBillingAddress',
                },
                {
                    alignment: 'right',
                    text: user.address,
                    style: 'invoiceBillingAddress',
                },
            ],
        },
        {
            columns: [
                {
                    text: 'Contact',
                    color: '#aaaaab',
                    bold: true,
                    margin: [0, 7, 0, 3],
                },
                {
                    alignment: 'right',
                    text: 'Contact',
                    color: '#aaaaab',
                    bold: true,
                    margin: [0, 7, 0, 3],
                },
            ],
        },
        {
            columns: [
                {
                    text: 'Jurgen Xhaja \n finance@ourplatform.uk',
                    style: 'invoiceBillingAddress',
                },
                {
                    alignment: 'right',
                    text: '',
                    style: 'invoiceBillingAddress',
                },
            ],
        },
        '\n\n',
        {
            width: '100%',
            alignment: 'center',
            text: 'Invoice No. 1',
            bold: true,
            margin: [0, 10, 0, 10],
            fontSize: 15,
        },
        {
            layout: {
                defaultBorder: false,
                hLineWidth(i, node) {
                    return 1
                },
                vLineWidth(i, node) {
                    return 1
                },
                hLineColor(i, node) {
                    if (i === 1 || i === 0) {
                        return '#bfdde8'
                    }
                    return '#eaeaea'
                },
                vLineColor(i, node) {
                    return '#eaeaea'
                },
                hLineStyle(i, node) {
                    // if (i === 0 || i === node.table.body.length) {
                    return null
                    // }
                },
                // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                paddingLeft(i, node) {
                    return 10
                },
                paddingRight(i, node) {
                    return 10
                },
                paddingTop(i, node) {
                    return 2
                },
                paddingBottom(i, node) {
                    return 2
                },
                fillColor(rowIndex, node, columnIndex) {
                    return '#fff'
                },
            },
            table: {
                headerRows: 1,
                widths: ['*', 40, 40, 40, 50, 40],
                body: [
                    [
                        {
                            text: 'DESCRIPTION',
                            fillColor: '#eaf2f5',
                            border: [false, true, false, true],
                            margin: [0, 5, 0, 5],
                            textTransform: 'uppercase',
                        },
                        {
                            text: 'Quantity',
                            fillColor: '#eaf2f5',
                            border: [false, true, false, true],
                            margin: [0, 5, 0, 5],
                            textTransform: 'uppercase',
                        },
                        {
                            text: 'Unit Price',
                            fillColor: '#eaf2f5',
                            border: [false, true, false, true],
                            margin: [0, 5, 0, 5],
                            textTransform: 'uppercase',
                        },
                        {
                            text: 'AMOUNT',
                            border: [false, true, false, true],
                            alignment: 'right',
                            fillColor: '#eaf2f5',
                            margin: [0, 5, 0, 5],
                            textTransform: 'uppercase',
                        },
                    ],

                    orderData.products.map((product) => [
                        {
                            text: product.productTitle,
                            border: [false, false, false, true],
                            margin: [0, 5, 0, 5],
                            alignment: 'left',
                        },
                        {
                            text: product.quantity,
                            border: [false, false, false, true],
                            margin: [0, 5, 0, 5],
                            alignment: 'left',
                        },
                        {
                            text: (product.price / 100).toFixed(2),
                            border: [false, false, false, true],
                            margin: [0, 5, 0, 5],
                            alignment: 'left',
                        },
                        {
                            border: [false, false, false, true],
                            text: (product.price * product.quantity / 100).toFixed(2),
                            alignment: 'right',
                            margin: [0, 5, 0, 5],
                        },
                    ]),
                ],
            },
        },
        '\n',
        '\n\n',
        {
            layout: {
                defaultBorder: false,
                hLineWidth(i, node) {
                    return 1
                },
                vLineWidth(i, node) {
                    return 1
                },
                hLineColor(i, node) {
                    return '#eaeaea'
                },
                vLineColor(i, node) {
                    return '#eaeaea'
                },
                hLineStyle(i, node) {
                    // if (i === 0 || i === node.table.body.length) {
                    return null
                    // }
                },
                // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                paddingLeft(i, node) {
                    return 10
                },
                paddingRight(i, node) {
                    return 10
                },
                paddingTop(i, node) {
                    return 3
                },
                paddingBottom(i, node) {
                    return 3
                },
                fillColor(rowIndex, node, columnIndex) {
                    return '#fff'
                },
            },
            table: {
                headerRows: 1,
                widths: ['*', 'auto'],
                body: [
                    [
                        {
                            text: 'Total',
                            border: [false, true, false, true],
                            alignment: 'right',
                            margin: [0, 5, 0, 5],
                        },
                        {
                            border: [false, true, false, true],
                            text: (totalAmount / 100).toFixed(2),
                            alignment: 'right',
                            fillColor: '#f5f5f5',
                            margin: [0, 5, 0, 5],
                        },
                    ],
                ],
            },
        },
        '\n\n',
        {
            text: 'NOTES',
            style: 'notesTitle',
        },
        {
            text: 'Some notes goes here \n Notes second line',
            style: 'notesText',
        },
    ],
    styles: {
        notesTitle: {
            fontSize: 10,
            bold: true,
            margin: [0, 50, 0, 3],
        },
        notesText: {
            fontSize: 10,
        },
    },
    defaultStyle: {
        columnGap: 20,
        // font: 'Quicksand',
    },
})

module.exports = userInvoice
