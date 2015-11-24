/**
 * Created by nborisov on 9/29/13.
 */
var nconf = require('nconf');
//
nconf.argv()
    .env()
    .file({ file: './config.json' });

module.exports = nconf;