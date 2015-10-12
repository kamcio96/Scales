/**
 * Scales.js — the flexible game management daemon built for PufferPanel.
 * Licensed under a GPL-v3 license.
 */
var Rfr = require('rfr');
var Async = require('async');
var Proc = require('child_process');
var Yargs = require('yargs').argv;
var Logger = Rfr('lib/logger.js');
var Servers = Rfr('lib/initalize.js').servers;

Logger.info('+ ========================================== +');
Logger.info('| Scales logs all information, (inc. errors) |');
Logger.info('| into the logs/ directory. Please check     |');
Logger.info('| there before asking for help with bugs.    |');
Logger.info('|                                            |');
Logger.info('| '.reset + 'Submit bug reports at the following link: '.red + ' |');
Logger.info('| https://github.com/PufferPanel/Scales      |');
Logger.info('+ ========================================== +');

Proc.exec('cd lib/scripts && chmod +x *.sh', function (err, stdout, stderr) {

    if (err) {
        Logger.error('An error occured while attempting to correct script permissions on boot.', stderr);
    } else {
        Logger.verbose('All scripts in /lib/scripts successfully had their permissions updated.');
    }

});

Rfr('lib/interfaces/restify.js');
Rfr('lib/interfaces/socket.js');

process.on('SIGINT', function () {

    Logger.warn('Detected hard shutdown! Stopping all running server containers.');
    Async.forEachOf(Servers, function (value, key, next) {

        Servers[key].dockerKillContainer();
        return next();

    }, function (err) {

        Logger.warn('All running server containers stopped successfully.');
        process.exit(0);

    });

});
