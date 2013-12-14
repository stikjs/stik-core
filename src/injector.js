window.stik || (window.stik = {});

(function(){
  function Injector(context, modules){
    this.$$context = context;
    this.$$modules = modules;
  };

  Injector.prototype.$resolveDependencies = function(){
    var args = this.$extractArguments(this.$$context);

    return this.$grabModules(args);
  };

  Injector.prototype.$extractArguments = function(){
    var argsPattern = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

    var contextAsString = this.$$context.toString();

    var args = contextAsString.match(argsPattern)[1].split(',');

    return this.$trimmedArgs(args);
  };

  Injector.prototype.$grabModules = function(args){
    var dependencies = [];

    for (var i = 0; i < args.length; i++) {
      dependencies.push(this.$$modules[args[i]]);
    };

    return dependencies;
  };

  Injector.prototype.$trimmedArgs = function(args){
    var result = [];
    args.forEach(function(arg){
      result.push(arg.trim());
    });
    return result;
  };

  stik.Injector = Injector;
})();
