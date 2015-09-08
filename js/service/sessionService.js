'use strict' ;

Lucy.factory( 'sessionService', [ '$http', '$cookies', 'infoService', 'updateService', function( $http, $cookies, infoService, updateService ) {
  
  function set( konto, scope, successCallback, failureCallback ) {
    //http://weblogs.asp.net/dwahlin/cancelling-route-navigation-in-angularjs
    var $promise = $http.post( '/ajax/post/startSession/?'+lucy_v, konto );
    $promise.then( function( response ) {
      successCallback( response );
    }, function( response ) {
      failureCallback( response );
    });
  };
  
  function destroy( scope, secret, successCallback, failureCallback ) {
    var data = { secret: secret };
    var $promise = $http.post( '/ajax/get/sessionDestroy/?'+lucy_v, JSON.stringify( data ) ); 
    $promise.then( function( response ) {
      successCallback( response );
      removeSecret();
      removeCookie();
      removeCookie( 'wersja' );
    }, function( response ){
      failureCallback( response );
      removeSecret();
      removeCookie();
      removeCookie( 'wersja' );
    });
  };
  
  function sesjaCzyAktywna() {
    if( getCookie() || getSecret() ) {
      return true;
    }
    else {
      return false;
    }
  };
  
  function check( successCallback, failureCallback, updateSystem ) {
    if( updateSystem === undefined )
      updateSystem = true;
    var checkSession = function() {
      if( !sesjaCzyAktywna() ) {
        failureCallback( 0 );
        return false;
      }
      if( getCookie() && !getSecret() ) {
        setSecret( getCookie().secret );
      }
      var cookieValue = getCookie() ? getCookie() : false;
      var data = {
        secret: getSecret(),
        cookieValue: cookieValue
      };
      var $promise = $http.post( '/ajax/get/checkSession/?'+lucy_v, data );
      $promise.then( function( response ) {
        successCallback( response );
      }, function( response ) {
        failureCallback( response );
      });
    }
    if( updateSystem ) {
      updateService.sprawdzAktualizacje( function() {
        checkSession();
      }, function() {} );
    }
    else checkSession();
  };
  
  
  function setSecret( secret ) {
    sessionStorage.setItem( 'secret', secret );
  };
  function getSecret() {
    return sessionStorage.getItem( 'secret' ); 
  };
  function removeSecret() {
    sessionStorage.removeItem( 'secret' );
  };
  
  function setCookie( object ) {
    var today = new Date();
    var params = {
      path: '/',
      expires: addMonths( new Date(), 1 )
    };
    $cookies.putObject( 'lucys_secret', object, params );
  };
  function getCookie() {
    return $cookies.getObject( 'lucys_secret' );
  };
  function removeCookie( key ) {
    key = key ? key : 'lucys_secret';
    $cookies.remove( key );
  };
  
  function addMonths(dateObj, num) {
    var currentMonth = dateObj.getMonth();
    dateObj.setMonth(dateObj.getMonth() + num)
    if (dateObj.getMonth() != ((currentMonth + num) % 12)){
        dateObj.setDate(0);
    }
    return dateObj;
  };
  
  return {
    set: set,
    setSecret: setSecret,
    getSecret: getSecret,
    setCookie: setCookie,
    getCookie: getCookie,
    removeCookie: removeCookie,
    destroy: destroy,
    check: check,
  }
}]);