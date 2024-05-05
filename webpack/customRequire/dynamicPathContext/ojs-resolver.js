const dynamicPathContext = import.meta.webpackContext("../../../node_modules/@oracle/oraclejet/dist/js/libs", {
    recursive: true,
    regExp: new RegExp('oj/debug/(ojcontext|ojcustomelement-utils).js'),
});
dynamicPathContext.keys().forEach(dynamicPathContext);

/**
 * Requried for @oracle/oraclejet-webdriver
 */
export default function(path) {
    const newPath = path.replace(/^ojs\/(.*)/, './oj/debug/$1.js')
    return dynamicPathContext(newPath)
}
