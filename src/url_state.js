(function(){
  function UrlState(){}

  UrlState.prototype.$baseUrl = function(){
    return location.href;
  };

  UrlState.prototype.$pathName = function(){
    return location.pathName;
  };

  UrlState.prototype.$mainPath = function() {
    return "/" + this.$pathName().split("/")[1];
  };

  UrlState.prototype.$queries = function(){
    var result, queries, query;

    queries = this.$baseUrl().split("?")[1];

    if (queries) {
      queries = queries.split("&");
      result = {};
      for (var i = 0; i < queries.length; i++) {
        query = queries[i].split("=");

        result[query[0]] = query[1];
      }
      return result;
    } else {
      return {};
    }
  };

  window.stik.UrlState = UrlState;
})();
