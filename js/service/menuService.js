'use strict';

Lucy.factory( 'menuService', function( $location ) {
  
  function activeClass( path, scope ) {
    if ($location.path().substr(0, path.length) === path) {
      return 'active';
    } else {
      return '';
    }
  }
  
  return {
    activeClass: activeClass 
  }
  
});