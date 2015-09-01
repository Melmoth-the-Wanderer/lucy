<div class="ui container">
  <div class="ui segment"> 
    <div ng-class="{ 'active': loading }" class="ui inverted dimmer">
      <div class="ui large text loader">Lokalizuję dłużników...</div>
    </div>
    <form class="ui form" ng-submit="kontoZarejestruj( $event, konto )" method="POST">
      <div class="field">
        <label for="id_register_email">Nazwa konta</label>
        <input id="id_register_email" name="register_email" type="text" ng-model="konto.nazwa"/>
        wymagania: min. 5 znaków, bez znaków specjalnych i polskich znaków diakrytycznych
      </div>
      <div class="field">
        <label for="id_register_pass">Hasło</label>
        <input id="id_register_pass" name="register_email" type="password" ng-model="konto.haslo"/> 
        wymagania: min. 5 znaków, 1 cyfra, min. 1 duża/mała litera
      </div>
      <div class="ui buttons">
        <button type="submit" class="ui yellow button"><i class="add user icon"></i>Załóż konto</button>
        <div class="or" data-text="lub"></div>
        <a href="#login" class="ui grey button">Anuluj</a>
      </div>
    </form>
    <div ng-include src="'/tpl/parts/message.tpl'"></div>
  </div>
</div>