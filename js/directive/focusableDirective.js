Lucy.directive( 'focusableDirective', function( $timeout ) {
  return {
    link: function( scope, element, attrs ) {
      $timeout( function() {
        var focusable = jQuery( element ).find( '.focus' );
        jQuery( element ).find( '.focusTrigger' ).click( function() {
          focusable.focus();
        });
        jQuery( element ).find( '.blurTrigger' ).click( function() {
          focusable.blur();
        });
      });
    }
  };
});