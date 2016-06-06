'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');

module.exports = function (db) {

    db.define('order', {
        status: {
            type: Sequelize.ENUM('received', 'processing', 'shipped', 'delivered', 'returnProcessing', 'returned'),
            defaultValue: 'received'
        },
        returnable: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        purchaseDate: {
            type: Sequelize.DATE
        },
        products: {
            // [{productId: id, productPrice: price}, {productId: id, productPrice: price}]
            type: Sequelize.ARRAY(Sequelize.JSON),
            allowNull: false
        }
    }, {
        getterMethods: {
            total: function () {
                return this.products.reduce(function (a, b) {
                    return a.productPrice + b.productPrice;
                });
            }
        }
    });
};
