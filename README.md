# pre-prush-commit-naming 

Heavily inspired by : 
https://www.npmjs.com/package/pre-commit and 
https://github.com/git/git/blob/master/templates/hooks--pre-push.sample

**Adds/replace** the pre-push hook in the .git/hook directory

**Warning** : it will replace the pre-push hook, this plugin is to be used alone.

A more generic solution needs to be found if you have multiple needs with the `pre-push` hook

## Installation :
Your favorite js package manager + the name pre-push-commit-naming-enforcement
```
yarn add pre-push-commit-naming-enforcement
npm install pre-push-commit-naming-enforcement
...
```
It will then run install.js on install and place the hook in the correct place

## Usage : 

A few config keys are availible, all setted/listed in `defaults.js`, and can be overrided in the project's `package.json`
you need to use the corresponding key : `pre-push-commit-naming-enforcement`


**package.json** :
```json
    ...
    "scripts": {}, 
    "pre-push-commit-naming-enforcement": {
        "enabled" : true,
        "regexToSeparateTitleAndBody" : ".",
        "regexToCheckTitle" : ".",
        "titleNotCorresponding" : "Commit title faulty, please see https://github.com/angular/angular/blob/master/CONTRIBUTING.md for guidelines"
    }
    ...
```

## Config keys

### `Enabled`, Boolean
If false, the commits won't be verified

### `regexToSeparateTitleAndBody`, Regular expression
This RegExp is used to separate the commit title and its body. 

Then the title shall be parsed for conformity.

If you wish to do a validation check on all the commit (body + title), you can use this regex : `"(\n|.)*"`

### `regexToCheckTitle`, Regular expression
The validation check. In the case of no-match, it is considered as an error. 

Meaning the evaluated 'title' **must** match the regex for the commit to be accepted

### `titleNotCorresponding`, String
The error message that will be displayed if the previous `regexToCheckTitle` fail