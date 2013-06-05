/*
 * Copyright 2013 Zeno Rocha, All Rights Reserved.
 *
 * Code licensed under the BSD License:
 * https://github.com/eduardolundgren/blob/master/LICENSE.md
 *
 * @author Zeno Rocha <zno.rocha@gmail.com>
 */

// -- Requires -----------------------------------------------------------------
var base = require('../base'),
    logger = require('../logger');

// -- Constructor --------------------------------------------------------------
function Organization(options) {
    this.options = options;
}

// -- Constants ----------------------------------------------------------------
Organization.DETAILS = {
    alias: 'or',
    description: 'Provides a set of util commands to work with Organizations.',
    options: {
        'sync': Boolean
    },
    shorthands: {
        's': [ '--sync' ]
    }
};

// -- Commands -----------------------------------------------------------------
Organization.prototype.run = function() {
    var instance = this,
        options = instance.options;

    if (options.sync) {
        logger.logTemplate('{{prefix}} [info] Syncing organizations from {{greenBright options.user}}', {
            options: options
        });

        instance.sync(function(err) {
            logger.defaultCallback(err, null);
        });
    }
};

Organization.prototype.sync = function(opt_callback) {
    var instance = this;

    instance.getOrgsFromUser(function(err, orgs) {
        if (!err) {
            base.writeGlobalConfig('orgs', orgs);
        }

        opt_callback && opt_callback(err);
    });
};

Organization.prototype.getOrgsFromUser = function(opt_callback) {
    var instance = this,
        options = instance.options,
        orgMap = {},
        payload;

    payload = {
        user: options.user
    };

    base.github.orgs.getFromUser(payload, function(err, orgs) {
        orgs.forEach(function(org) {
            orgMap[org.login] = org.id;
        });

        opt_callback && opt_callback(err, orgMap);
    });
};

exports.Impl = Organization;