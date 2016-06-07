const util = require('gulp-util');
const spawn = require('child_process').spawn;
const gulp = require('gulp');
const minimist = require('minimist');

const DANCER = '\uD83D\uDC83';

const FAIL_RETIRE_ARG = 'fail-retire';

const defaultArgs = {
    'fail-retire': true
};

var options = minimist(process.argv.slice(2), {
    'default': defaultArgs,
    'boolean': [FAIL_RETIRE_ARG]
});

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

    const output = [];
    child.stdout.on('data', function (data) {
        output.push(data);
    });

    const errors = [];
    child.stderr.on('data', function (data) {
        errors.push(data);
    });

    child.on('close', function() {
        util.log(output.join(''));

        if (errors.length > 0) {
            util.log(util.colors.red('Found vulnerable dependencies: \n' + errors.join('')));

            if (options[FAIL_RETIRE_ARG]) {
                throw 'Found security vulnerabilities. Run with `--' + FAIL_RETIRE_ARG + ' false` if you want to ignore.';
            }
        } else {
            util.log(util.colors.green('No vulnerable dependencies found! ' + DANCER +  DANCER));
        }
    });
};