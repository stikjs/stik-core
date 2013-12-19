(function(){
  function Injector(executionUnit, modules){
    this.$$executionUnit = executionUnit;
    this.$$modules = modules;
  }

  Injector.prototype.$resolveDependencies = function(){
    var args = this.$extractArguments();

    return this.$grabModules(args);
  };

  Injector.prototype.$extractArguments = function(){
    var argsPattern, funcString, args;

    argsPattern = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

    funcString = this.$$executionUnit.toString();

    args = funcString.match(argsPattern)[1].split(',');

    return this.$trimmedArgs(args);
  };

  Injector.prototype.$grabModules = function(args){
    var dependencies = [];

    if (args.length === 1 && args[0] === '') { return []; }

    for (var i = 0; i < args.length; i++) {
      dependencies.push(this.$$modules[args[i]]);
    }

    return dependencies;
  };

  Injector.prototype.$trimmedArgs = function(args){
    var result = [];
    args.forEach(function(arg){
      result.push(arg.trim());
    });
    return result;
  };

  window.stik.Injector = Injector;
})();
