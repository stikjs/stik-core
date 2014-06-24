(function( document, stik ){
  stik.action = function action( spec ){
    if ( !spec.controller ) { throw "Stik: Action needs an controller name"; }
    if ( !spec.name ) { throw "Stik: Action name can't be empty"; }
    if ( !spec.executionUnit ) { throw "Stik: Action needs a function to use as its execution unit"; }

    spec.bind = function bind( modules ){
      var templates = spec.findTemplates(),
          i = templates.length;

      while( i-- ){
        bindWithTemplate(
          templates[ i ]
        ).context.load( spec.executionUnit, modules );
        markAsBound( templates[ i ] );
      }

      return templates.length > 0;
    };

    spec.findTemplates = function findTemplates( DOMInjection ){
      var DOMHandler = document;
      if (DOMInjection) { DOMHandler = DOMInjection; }

      var selector = "[data-controller=" + spec.controller + "]" +
                     "[data-action=" + spec.name + "]" +
                     ":not([class*=stik-bound])";
      return DOMHandler.querySelectorAll( selector );
    };

    function bindWithTemplate( template ){
      return {
        context: stik.context({
          controller: spec.controller,
          action: spec.name,
          template: template
        }),
        executionUnit: spec.executionUnit
      };
    } spec.bindWithTemplate = bindWithTemplate;

    function markAsBound( template ){
      template.className = ( template.className + ' stik-bound').trim();
    }

    return spec;
  };
})( window.document, window.stik );
