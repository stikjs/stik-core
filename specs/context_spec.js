describe("Context", function(){
  describe("#load", function(){
    it("should run the execution unit it is bound to", function(){
      var template, modules, executionUnitDouble, injectedTemplate;

      injectedTemplate = false;

      template = document.createElement( "div" );

      executionUnitDouble = function( $template ){
        injectedTemplate = $template;
      };

      context = stik.context({
        controller: "AppCtrl",
        action: "list",
        template: template
      });

      context.load( executionUnitDouble, {} );

      expect( injectedTemplate ).toEqual( template );
    });
  });
});
