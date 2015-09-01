'use strict';
Lucy.config( [ '$routeProvider', function( $routeProvider ) {
  $routeProvider.when( '/404', {
    templateUrl: '/tpl/404.tpl?v='+lucy_v,
    controller: '404Ctrl'
  });
  $routeProvider.when( '/home', {
    templateUrl: '/tpl/home.tpl?v='+lucy_v,
    controller: 'homeCtrl'
  });  
  $routeProvider.when( '/login', {
    templateUrl: '/tpl/login.tpl?v='+lucy_v,
    controller: 'loginCtrl'
  }); 
  $routeProvider.when( '/register', {
    templateUrl: '/tpl/register.tpl?v='+lucy_v,
    controller: 'registerCtrl'
  });
  $routeProvider.when( '/budzet', {
    templateUrl: '/tpl/budzet.tpl?v='+lucy_v,
    controller: 'budzetCtrl'
  });
  $routeProvider.when( '/budzet/:id/edytuj', {
    templateUrl: '/tpl/budzet_id_edytuj.tpl?v='+lucy_v,
    controller: 'budzetIdEdytujCtrl'
  });
  $routeProvider.when( '/budzet/:id', {
    templateUrl: '/tpl/budzet_id.tpl?v='+lucy_v,
    controller: 'budzetIdCtrl'
  });
  $routeProvider.otherwise({ redirectTo: '/404' });
}]);