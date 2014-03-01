(function(){
  function Injector(executionUnit, modules){
    this.$$executionUnit = executionUnit;
    this.$$modules       = modules;
  }

  Injector.method("$resolveDependencies", function(){
    var args = this.$extractArguments();

    return this.$grabModules(args);
  });

  Injector.method("$extractArguments", function(){
    var argsPattern, funcString, args;

    argsPattern = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

    funcString = this.$$executionUnit.toString();

    args = funcString.match(argsPattern)[1].split(',');

    return this.$trimmedArgs(args);
  });

  Injector.method("$trimmedArgs", function(args){
    var result = [];
    args.forEach(function(arg){
      result.push(arg.trim());
    });
    return result;
  });

  Injector.method("$grabModules", function(args){
    var module, dependencies;

    dependencies = [];

    if (args.length === 1 && args[0] === "") { return []; }

    for (var i = 0; i < args.length; i++) {
      if (!(module = this.$$modules[args[i]])) {
        throw "Stik could not find this module (" + args[i] + ")";
      }

      dependencies.push(
        module.resolve(this.$$modules)
      );
    }

    return dependencies;
  });

  window.stik.Injector = Injector;
})();
