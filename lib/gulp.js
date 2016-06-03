const util = require('gulp-util');
const spawn = require('child_process').spawn;
const dancer = '\uD83D\uDC83';

module.exports = function() {
    // Only scan npm production dependencies
    const args = ['--node', '--package'];
    const child = spawn('./node_modules/retire/bin/retire', args, {cwd: process.cwd()});

    child.on('error', function(error) {
        util.log(util.colors.red('Unable to spawn retire. Have you tried `npm install`?'));
        throw error;
    });

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');

    child.stdout.on('data', function (data) {
        util.log(data);
    });

    const errors = [];
    child.stderr.on('data', function (data) {
        errors.push(data);
    });

    child.on('close', function() {
        if (errors.length > 0) {
            util.log(util.colors.red('Found vulnerable dependencies:'));
            errors.forEach(function(error) {
                util.log(util.colors.red(error))
            });
            throw new Error('Found security vulnerabilities :(');
        } else {
            util.log(util.colors.green('No security vulnerabilities found! ' + dancer +  dancer));
        }
    });
};