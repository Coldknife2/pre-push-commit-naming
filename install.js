'use strict';

/*
*   Around 90% of this code came from https://github.com/observing/pre-commit/blob/master/install.js under MIT license
*/

//
// Compatibility with older node.js as path.exists got moved to `fs`.
//
var fs = require('fs')
  , path = require('path')
  , gitHookPath = path.join(__dirname, 'pre-push-hook')
  , hookPath = path.join(__dirname, 'index.js')
  , os = require('os')
  , root = path.resolve(__dirname, '..', '..')
  , exists = fs.existsSync || path.existsSync;

//
// Gather the location of the possible hidden .git directory, the hooks
// directory which contains all git hooks and the absolute location of the
// `pre-push-commit-naming-enforcement` file. The path needs to be absolute in order for the symlinking
// to work correctly.
//

var git = getGitFolderPath(root);

// Function to recursively find .git folder
function getGitFolderPath(currentPath) {
  var git = path.resolve(currentPath, '.git')

  if (!exists(git) || !fs.lstatSync(git).isDirectory()) {
    console.log('pre-push-commit-naming-enforcement:');
    console.log('pre-push-commit-naming-enforcement: Not found .git folder in', git);
    
    var newPath = path.resolve(currentPath, '..');

    // Stop if we are on the top folder
    if (currentPath === newPath) {
      return null;
    }

    return getGitFolderPath(newPath);
  }

  console.log('pre-push-commit-naming-enforcement:');
  console.log('pre-push-commit-naming-enforcement: Found .git folder in', git);
  return git;
}

//
// Resolve git directory for submodules
//
if (exists(git) && fs.lstatSync(git).isFile()) {
  var gitinfo = fs.readFileSync(git).toString()
    , gitdirmatch = /gitdir: (.+)/.exec(gitinfo)
    , gitdir = gitdirmatch.length == 2 ? gitdirmatch[1] : null;

  if (gitdir !== null) {
    git = path.resolve(root, gitdir);
    hooks = path.resolve(git, 'hooks');
    prepush = path.resolve(hooks, 'pre-push-commit-naming-enforcement');
  }
}

//
// Bail out if we don't have an `.git` directory as the hooks will not get
// triggered. If we do have directory create a hooks folder if it doesn't exist.
//
if (!git) {
  console.log('pre-push-commit-naming-enforcement:');
  console.log('pre-push-commit-naming-enforcement: Not found any .git folder to install the hook');
  return;
}

var hooks = path.resolve(git, 'hooks')
  , prepush = path.resolve(hooks, 'pre-push');

if (!exists(hooks)) fs.mkdirSync(hooks);

//
// If there's an existing `pre-push-commit-naming-enforcement` hook we want to back it up instead of
// overriding it and losing it completely as it might contain something
// important.
//
if (exists(prepush) && !fs.lstatSync(prepush).isSymbolicLink()) {
  console.log('pre-push-commit-naming-enforcement:');
  console.log('pre-push-commit-naming-enforcement: Detected an existing git pre-push hook');
  fs.writeFileSync(prepush +'.old', fs.readFileSync(prepush));
  console.log('pre-push-commit-naming-enforcement: Old pre-push hook backuped to pre-push.old');
  console.log('pre-push-commit-naming-enforcement:');
}

//
// We cannot create a symlink over an existing file so make sure it's gone and
// finish the installation process.
//
try { fs.unlinkSync(prepush); }
catch (e) {}

var hookRelativeUnixPath = hookPath.replace(root, '.');

if(os.platform() === 'win32') {
  hookRelativeUnixPath = hookRelativeUnixPath.replace(/[\\\/]+/g, '/');
}

const hookContent = fs.readFileSync(gitHookPath, 'utf8').replace("$$HOOK_DESTINATION$$", `node ${hookRelativeUnixPath}`);

//
// It could be that we do not have rights to this folder which could cause the
// installation of this module to completely fail. We should just output the
// error instead of destroying the whole npm install process.
//
try { fs.writeFileSync(prepush, hookContent); }
catch (e) {
  console.error('pre-push-commit-naming-enforcement:');
  console.error('pre-push-commit-naming-enforcement: Failed to create the hook file in your .git/hooks folder because of:');
  console.error('pre-push-commit-naming-enforcement: '+ e.message);
  console.error('pre-push-commit-naming-enforcement: The hook was not installed.');
  console.error('pre-push-commit-naming-enforcement:');
}

try { fs.chmodSync(prepush, '777'); }
catch (e) {
  console.error('pre-push-commit-naming-enforcement:');
  console.error('pre-push-commit-naming-enforcement: chmod 0777 the pre-push file in your .git/hooks folder because of:');
  console.error('pre-push-commit-naming-enforcement: '+ e.message);
  console.error('pre-push-commit-naming-enforcement:');
}
