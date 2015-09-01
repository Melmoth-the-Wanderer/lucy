  <div class="ui segment"> 
    <div ng-class="{ 'active': loading }" class="ui large inverted dimmer">
      <div class="ui large text loader">Logowanie</div>
    </div>
    <div class="ui two column middle aligned stackable grid" style="position: relative">
      <div class="column">
        <form ng-submit="zaloguj( $event, konto )" class="ui form"  method="POST">
          <div class="field">
            <label>Nazwa konta</label>
            <div class="ui left icon input">
              <input placeholder="Nazwa" type="text" ng-model="konto.nazwa">
              <i class="user icon"></i>
            </div>
          </div>
          <div class="field">
            <label>Hasło</label>
            <div class="ui left icon input">
              <input placeholder="Hasło" type="password" ng-model="konto.haslo">
              <i class="asterisk icon"></i>
            </div>
          </div>
          <button type="submit" ng-click="" class="ui submit button">
            <i class="unlock icon"></i>
            {{ zalogowany | iif : 'Przeloguj' : 'Zaloguj' }}
          </button>
          <div class="ui checkbox">
            <input id="id_sesja_tymczasowa" name="sesja" type="checkbox" ng-model="konto.zapamietaj">
            <label for="id_sesja_tymczasowa">Nie wylogowuj mnie</label>
          </div>
        </form>
        <div ng-include src="'/tpl/parts/message.tpl'"></div>
      </div>
      <div class="ui vertical divider">
        Lub
      </div>
      <div class="center aligned column">
        <a href="#register" ng-class="{ 'disabled': zalogowany }" class="ui huge yellow button"><i class="add user icon"></i>Załóż konto</a>
      </div>
    </div>
  </div>