describe("Controller", function(){
  describe("#action", function(){
    it("single action controller", function(){
      var template, ctrl;

      template = document.createElement( "div" );
      template.innerHTML = "<span></span>";

      ctrl = stik.controller( "StarWarsCtrl", "Revelation", function( $template ){
        $template.textContent = "Father!!!!!!";
      });

      spyOn(
        ctrl.actions[ "Revelation" ], "findTemplates"
      ).andReturn( [ template ] );

      stik.$$manager.bindActions();

      expect( template.textContent ).toEqual( "Father!!!!!!" );
    });

    it("multiple action controller", function(){
      var template, result, ctrl;

      template = document.createElement( "div" );
      template.innerHTML = "<span></span>";

      ctrl = stik.controller( "StarWarsCtrl", function( ctrl ){} );

      action = ctrl.action( "Response", function( $template ){
        $template.textContent = "NNNOOOOOOO!!!!!!";
      });

      spyOn( action, "findTemplates" ).andReturn( [ template ] );

      stik.$$manager.bindActions();

      expect( template.textContent ).toEqual( "NNNOOOOOOO!!!!!!" );
    });
  });
});
