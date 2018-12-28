const path = require('path');
const colors = require('colors');

const receivedArguments = process.argv.slice(2);
const [localRef, commitId, gitHookDirectory, commitMsg] = receivedArguments;
const projectDirectory = gitHookDirectory.replace(/\.git\/hooks$/, '');

const defaults = require('./defaults');

let packageJson;

try {
    packageJson = require(path.join(projectDirectory, 'package.json'));
} catch (e) {
    console.log(defaults.errorWhileParsingPackageJson, e);
    process.exit(1); 
}

let config = packageJson['pre-push-commit-naming-enforcement'] || {};
function getConfFromKey(key)
{
    return (config[key] !== undefined) ? config[key] : defaults[key];
}

/* pre-push module is disabled, we stop right there */
if( !getConfFromKey("enabled") )
{
    console.log(getConfFromKey("enabled"));
    process.exit(0);
}

let [, title, body] = new RegExp(getConfFromKey("regexToSeparateTitleAndBody")).exec(commitMsg);
if(new RegExp(getConfFromKey("regexToCheckTitle")).exec(title) === null)
{
    console.log(defaults.titleNotCorresponding.red);
    console.log(`Involved branch : ${localRef}`.yellow);
    console.log(`Involved commit id : ${commitId}`.yellow);
    console.log(`Involved commit title : ${title}`.underline.yellow);
    process.exit(1);
}

process.exit(0);