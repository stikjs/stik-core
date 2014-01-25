(function(){
  function ControllerLab(env){
    validate(env);

    this.$$env      = env;
    this.$$template = parseAsDOM(env.template);
    this.$$context  = undefined;
  }

  function validate(env){
    if (!env) { throw "Lab needs an environment to run" };
    if (!env.name) { throw "name can't be empty"; }
    if (!env.action) { throw "action can't be empty"; }
    if (!env.template) { throw "template can't be empty"; }
  }

  function parseAsDOM(template){
    var elmement = document.createElement("div");
    elmement.innerHTML = template;
    return elmement.firstChild;
  }

  ControllerLab.prototype.run = function(){
    var result = window.stik.$$manager.$bindExecutionUnitWithTemplate(
      this.$$env.name,
      this.$$env.action,
      this.$$template
    );

    this.$$context = result[0];

    this.$$context.$load(result[1]);
  };

  window.stik.labs.Controller = ControllerLab;
})();
