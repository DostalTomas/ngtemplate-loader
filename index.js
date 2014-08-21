var loaderUtils = require("loader-utils");

module.exports = function (content) {
    this.cacheable && this.cacheable();

    var query = loaderUtils.parseQuery(this.query);
    var ngModule = query.module || 'ngTemplates';
    var relativeTo = query.relativeTo || '';
    var path = this.resource.slice(relativeTo.length); // get the base path
    var html = content.match(/^module\.exports/) ?
        content.substr(findQuote(content, false), findQuote(content, true)) :
        content;

    return "angular.module('" + ngModule + "').run(['$templateCache', function(c) { c.put('"+ path +"', " + html + ") }]);";

    function findQuote(content, backwards) {
        var i = backwards ? content.length - 1 : 0;
        while (i >= 0 && i < content.length) {
            if (content[i] == '"' || content[i] == "'") {
                return i;
            }
            i += backwards ? -1 : 1;
        }
        return -1;
    }
};