const asciiTable = require("ascii-table");

module.exports.getProducts = function (queryString, connection, cb) {
    connection.query(queryString, function (err, res) {
        if (err) throw err;
        cb(res)
    })
}

module.exports.createTable = function (res, isCustomer) {
    let table = new asciiTable("Bamazon Products")
    if (isCustomer) {
        table.setHeading("id", "product", "department", "price", "quantity")
        res.forEach(item => {
            let {
                item_id,
                product_name,
                department_name,
                price,
                stock_quantity
            } = item
            table.addRow(item_id, product_name, department_name, price, stock_quantity)
        });
    } else {
        table.setHeading("item_id", "product", "department", "price", "quantity", "sales")
        res.forEach(item => {
            let {
                item_id,
                product_name,
                department_name,
                price,
                stock_quantity,
                product_sales
            } = item
            table.addRow(item_id, product_name, department_name, price, stock_quantity, product_sales)
        });
    }
    return table;
}