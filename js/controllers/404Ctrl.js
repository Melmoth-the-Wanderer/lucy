'use strict';

Lucy.controller( '404Ctrl', function( $rootScope, $scope, infoService ) {

  $rootScope.title = "a'la 404 error";
  var info = {};
  info.error = "Błąd 404";
  info.info = "Wygląda na to, że ta podstrona jeszcze nie istnieje. Spróbuj ponownie za jakiś czas...";
  infoService.setInfo( info, 0 );
  
});