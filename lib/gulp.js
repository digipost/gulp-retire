const util = require('gulp-util');
const spawn = require('child_process').spawn;
const minimist = require('minimist');
const path = require('path');
const fs = require('fs');

const DANCER = '\uD83D\uDC83';
const FAIL_RETIRE_ARG = 'fail-retire';
const STATUS_VULNERABILITIES_FOUND = 13;
const STATUS_OK = 0;

const defaultArgs = {
    'fail-retire': true
};

var options = minimist(process.argv.slice(2), {
    'default': defaultArgs,
    'boolean': [FAIL_RETIRE_ARG]
});

module.exports = function(opts) {
    opts = opts || {};
    opts.args = opts.args || '--node --package';
    opts.cwd = opts.cwd || process.cwd();
    opts.done = opts.done || function() {};

    const child = spawn(retireExecutable(), opts.args.split(' '), { cwd: opts.cwd });

    child.on('error', function(error) {
        util.log(util.colors.red('Unable to spawn retire. Have you tried `yarn install`?'));
        throw error;
    });

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');

    const output = [];
    const errors = [];
    var allOutput = '';
    child.stdout.on('data', function (data) { output.push(data); allOutput += data; });
    child.stderr.on('data', function (data) { errors.push(data); allOutput += data; });

    child.on('close', function(status) {
        util.log(output.join(''));


        switch(status) {
            case STATUS_VULNERABILITIES_FOUND:
                util.log(util.colors.red('Found vulnerable dependencies: \n' + errors.join('')));

                if (options[FAIL_RETIRE_ARG]) {
                    throw 'Found security vulnerabilities. Run with `--' + FAIL_RETIRE_ARG + ' false` if you want to ignore.';
                }
                break;
            case STATUS_OK:
                util.log(util.colors.green('No vulnerable dependencies found! ' + DANCER +  DANCER));
                break;
            default:
                util.log(util.colors.red('Retire.js exited with status code ' + status + ', which indicates something exploded a bit 🔥.') + ' Captured output: \n' + allOutput);
                break;
        }

        opts.done();
    });
};

function retireExecutable() {
    const bin = path.join(path.dirname(require.resolve('retire')), '../bin');
    return bin + '/retire';
}