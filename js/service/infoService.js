'use strict';

Lucy.factory( 'infoService', function( $rootScope ) {
  
  function clearInfo() {
    $rootScope.info = {};
  }
  
  function setInfo( info, keep ) {
    var info = info || {};
    info = {
      success: info.success ? info.success : false,
      error: info.error ? info.error : false,
      info: info.info ? info.info : false,
      danger: info.danger ? info.danger : false
    };
    var keep = ( keep === 0 ? keep : 1 );
    $rootScope.info = info;
    if( keep === 1 )
      $rootScope.keepInfo = 1;
  }
  
  return {
    setInfo: setInfo,
    clearInfo: clearInfo
  }
  
});