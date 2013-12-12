window.slik || (window.slik = {});

(function(){
  function Context(controller, action, template){
    if (!controller)
      throw "controller is missing";
    if (!action)
      throw "action is missing";
    if (!template)
      throw "template is missing";

    this.$validateTemplate(template);

    this.controller = controller;
    this.action = action;
    this.template = template;
  };

  Context.prototype.$validateTemplate = function(template){
    if (!template.getAttribute('controller'))
      throw "template does not define a controller";
    if (!template.getAttribute('action'))
      throw "template does not define an action";
  };

  slik.Context = Context;
})();
