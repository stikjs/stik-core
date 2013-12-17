window.stik || (window.stik = {});

(function(){
  function UrlState(){}

  UrlState.prototype.$baseUrl = function(){
    return location.href;
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

  stik.UrlState = UrlState;
})();
