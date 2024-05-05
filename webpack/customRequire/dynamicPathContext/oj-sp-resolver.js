const dynamicPathContext = import.meta.webpackContext(
    "../../../exchange_components",
    {
        recursive: true,
        regExp: /oj-sp\/smart-search\/default-filters\/(SelectSingleFilter|DateRangeFilter).js$/
    });
dynamicPathContext.keys().forEach(dynamicPathContext);
export default function(path) {
    return dynamicPathContext(path + '.js');
}
