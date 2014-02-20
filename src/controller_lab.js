(function(){
  function ControllerLab(env){
    validate(env);

    this.$$env      = env;
    this.$$template = parseAsDOM(env.template);
    this.$$context  = undefined;

    var result = window.stik.$$manager.$bindActionWithTemplate(
      this.$$env.name,
      this.$$env.action,
      this.$$template
    );

    this.$$context = result.context;
    this.$$modules = result.modules;
    this.$$executionUnit = result.executionUnit;
  }

  function validate(env){
    if (!env) { throw "Lab needs an environment to run"; }
    if (!env.name) { throw "name can't be empty"; }
    if (!env.action) { throw "action can't be empty"; }
    if (!env.template) { throw "template can't be empty"; }
  }

  function parseAsDOM(template){
    var tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = template;
    return tmp.body.firstChild;
  }

  ControllerLab.method("run", function(){
    this.$$context.$load(this.$$executionUnit, this.$$modules);
  });

  window.stik.labs.Controller = ControllerLab;
})();
