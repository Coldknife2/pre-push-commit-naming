/* Overridable values */
const enabled = true;
const regexToSeparateTitleAndBody = /(.+)((?:\n|.)*)?/;
const regexToCheckTitle = /^(chore|docs|style|refactor|perf|test|feat|fix)(\(.+\))?:/;
const titleNotCorresponding = "[pre-push-commit-naming-enforcement][ERROR] Commit title not corresponding to standard";

/* Not overridable */
const errorWhileParsingPackageJson = "[pre-push-commit-naming-enforcement][ERROR] Error while trying to parse package.json : ";

module.exports = {
    enabled,
    regexToSeparateTitleAndBody,
    regexToCheckTitle,
    titleNotCorresponding,
    errorWhileParsingPackageJson
};