const routes = require('next-routes')();

routes
    .add('/', '/')
    .add('/add-account', '/add-account');

module.exports = routes;
