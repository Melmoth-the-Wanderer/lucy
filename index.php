<?php 
  header('Content-Type: text/html; charset=utf-8');
  require_once( 'Class/System.php' );
  $system = new System();
  $lucy_v = $system->wyplujAktualnaWersje();
  setcookie( 'wersja', $lucy_v );
?>
<!DOCTYPE html>
<html lang="pl-pl" ng-app="Lucy">
  <head>
    <title>Lucy!</title>
    
    <meta http-equi?v="X-UA-Compatible" content="IE=Edge">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="robots" content="noindex">
    
    <!-- jQuery -->
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    
    <!-- SMEANTIC.UI -->
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.0.8/semantic.css" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.0.8/semantic.js"></script>
    
    <!-- Angular.JS -->
    <script src="//code.angularjs.org/1.4.3/angular.js"></script>
    <script src="//code.angularjs.org/1.4.3/angular-route.js"></script>
    <script src="//code.angularjs.org/1.4.3/angular-resource.js"></script>
    <script src="//code.angularjs.org/1.4.3/angular-cookies.js"></script>
    
    <script src="js/app.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/config.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/run.js<?php echo '?v='.$lucy_v;?>"></script>

    <script src="js/directive/infoDirective.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/directive/focusableDirective.js<?php echo '?v='.$lucy_v;?>"></script>

    <script src="js/controllers/404Ctrl.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/controllers/spinCtrl.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/controllers/menuCtrl.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/controllers/homeCtrl.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/controllers/loginCtrl.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/controllers/registerCtrl.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/controllers/infoCtrl.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/controllers/budzetCtrl.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/controllers/budzetIdCtrl.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/controllers/budzetIdEdytujCtrl.js<?php echo '?v='.$lucy_v;?>"></script>

    <script src="js/service/updateService.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/service/spinService.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/service/menuService.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/service/sessionService.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/service/kontoService.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/service/infoService.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/service/budzetService.js<?php echo '?v='.$lucy_v;?>"></script>
    <script src="js/service/operacjaService.js<?php echo '?v='.$lucy_v;?>"></script>

    <!-- Angularify Semantic UI -->
    <?php /* <script src="js/angular-semantic-ui.js<?php echo '?v='.$lucy_v;?>"></script> */ ?>
    
    <!-- OFFLINE.js -->
    <script src="js/offline.min.js"></script>
    <link rel="stylesheet" href="css/offline-theme-dark-indicator.css<?php echo '?v='.$lucy_v;?>" />
    <link rel="stylesheet" href="css/offline-language-english.css<?php echo '?v='.$lucy_v;?>" />
    <link rel="stylesheet" href="css/offline-language-english-indicator.css<?php echo '?v='.$lucy_v;?>" />

    <!-- Dodatkowe -->
    <link rel="stylesheet" href="css/style.css<?php echo '?v='.$lucy_v;?>" />
    <script>
      var lucy_v = '<?php echo $lucy_v; ?>';
    </script>
    <?php require_once( 'GA.php' ); ?>
  </head>
  <body>
    <div ng-class="{ 'active': loading > 0 }" ng-controller="spinCtrl" class="ui inverted dimmer">
      <div class="ui large text loader">{{ loadingMessage }}</div>
    </div>
    <header ng-controller="menuCtrl">
      <div class="ui brown pointing menu">
        <a href="#home" ng-class="activeClass( '/home' )" class="item">
          Pulpit
        </a>
        <a href="#budzet" ng-if="zalogowany" ng-class="activeClass( '/budzet' )" class="item">
          Budżet
        </a>
        <a href="#login" ng-if="!zalogowany" ng-class="activeClass( '/login' )" class="item">
          Zaloguj
        </a>
        <a href="#register" ng-if="!zalogowany" ng-class="activeClass( '/register' )" class="item">
          Zarejestruj
        </a>
        <div ng-if="zalogowany" class="right menu">
          <div ng-if="lucy_v"class="item">
            <a ng-click="aktualizacjeSprawdz( $event )" href="#">v{{ lucy_v }}</a>
          </div>
          <div class="item">
            <div class="ui small buttons">
              <a href="#" ng-click="wyloguj( $event )" class="ui icon button"><i class="lock icon"></i></a>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <h1 ng-if="title" class="ui header container">
      {{ title }}
      <div ng-if="subtitle" class="sub header">{{ subtitle }}</div>  
    </h1>
    <div ng-controller="infoCtrl" class="ui container">
      <div info-directive></div>
    </div>
    <div class="ui container" ng-view>
      <!-- ng-view -->
    </div>
  
  </body>
</html>
