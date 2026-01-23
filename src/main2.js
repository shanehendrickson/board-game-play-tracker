const nodes = [
    { hardwareOrder: "" },
    { hardwareOrder: {
        date: "01/01/26",
        qty: 1,
        partialOrders: []
    } },
    { hardwareOrder: {
        date: "01/02/26",
        qty: 1,
        partialOrders: [
            {
                date: "01/03/26",
                qty: 1,
            },
            {
                date: "01/04/26",
                qty: 1,
            },
        ]
    } },
]