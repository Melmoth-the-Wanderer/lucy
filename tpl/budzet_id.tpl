<div ng-class="{ 'active': loading }" class="ui inverted dimmer">
  <div class="ui large text loader">Przeliczam drobniaki...</div>
</div>


<div ng-switch on="hideMainActions">
  <div ng-switch-when="false">
    <a class="ui basic small red button" ng-click="usunBudzetToggle()"><i class="trash icon"></i>Rozwiąż</a>
    <a class="ui basic small button" ng-href="#budzet/{{ budzet.ID }}/edytuj"><i class="edit icon"></i>Edytuj</a>
    <a href="#budzet" class="ui basic small grey button"><i class="step backward icon"></i>Lista budzetów</a>
  </div>
</div>
<div ng-switch on="opcjaUsunBudzet">
  <div ng-switch-when="true">
    <form class="ui form" ng-submit="budzetUsun( $event, budzet.ID )" method="POST">
      <div class="ui orange message">
        <img class="ui mini avatar image" src="/img/lucy.png"> <i>Lucy:</i> <strong>&mdash; Zamierzasz usunąć trwale budżet.</strong>
      </div>
      <div ng-if="opcjaUsunBudzet" class="ui buttons">
        <button type="submit" class="ui olive button"><i class="trash icon"></i>OK, rozwiąż</button>
        <div class="or" data-text="lub"></div>
        <a ng-click="usunBudzetToggle()" class="ui grey button">Anuluj</a>
      </div>
    </form>
    <div ng-include src="'/tpl/parts/message.tpl'"></div>
  </div>
</div>


<div class="ui divider"></div>
<div class="ui container">
  <div class="ui four columns center aligned stackable grid">
    <div class="column">
      <div class="ui small statistic">
        <div class="value">
          {{ budzet.kwota }}
        </div>
        <div class="label">
          jednostek
        </div>
      </div>
    </div>
    <div focusable-directive class="column">
      <div ng-if="!opcjaDodajWydatek" class="ui huge buttons">
        <a ng-click="wydatekDodajToggle()" class="focusTrigger ui yellow button"><i class="minus icon"></i>Wydatek</a>
      </div>
      <form ng-submit="wydatekDodaj( wydatek.kwota, budzet.ID )" ng-show="opcjaDodajWydatek" class="ui form" method="POST">
        <div ng-class="{ 'active': loadingWydatekDodaj }" class="ui dimmer">
          <div class="ui text loader">Wypłacam...</div>
        </div>
        <div class="field">
          <input ng-model="wydatek.kwota" id="id_wydatek_kwota" class="focus" type="number" min="0.01" max="9999999999999.99" step="0.01" />
          <div class="ui tiny buttons">
            <button type="submit" class="ui olive button"><i class="minus icon"></i>Wydaj</button>
            <div class="or" data-text="lub"></div>
            <a ng-click="wydatekDodajToggle()" class="blurTrigger ui grey button">Anuluj</a>
          </div>
        </div>
      </form>
    </div>
    <div focusable-directive class="column">
      <div ng-if="!opcjaDodajPrzyplyw" class="ui huge buttons">
        <a ng-click="przyplywDodajToggle()" class="focusTrigger ui yellow button"><i class="plus icon"></i>Przypływ</a>
      </div>  
      <form ng-submit="przychodDodaj( przychod.kwota, budzet.ID )" ng-show="opcjaDodajPrzyplyw" class="ui form" method="POST">
        <div ng-class="{ 'active': loadingPrzychodDodaj }" class="ui dimmer">
          <div class="ui text loader">Lokuję...</div>
        </div>
        <div class="field">
          <input ng-model="przychod.kwota" id="id_przychod_kwota" class="focus" type="number" min="0.01" max="9999999999999.99" step="0.01" />
          <div class="ui tiny buttons">
            <button type="submit" class="ui olive button"><i class="plus icon"></i>Dodaj</button>
            <div class="or" data-text="lub"></div>
            <a ng-click="przyplywDodajToggle()" class="blurTrigger ui grey button">Anuluj</a>
          </div>
        </div>
      </form>
    </div>
    <div focusable-directive class="column">
      <div class="ui huge buttons">
        <a class="focusTrigger ui grey disabled button"><i class="exchange icon"></i>Transfer</a>
      </div>
    </div>
  </div>
  <div ng-include src="'/tpl/parts/message.tpl'"></div>
  <div class="ui divider"></div>
  <!--
  <div ng-if="!budzet.meta.isEmpty" class="ui big horizontal list">
    <div ng-if="budzet.start" class="item">
      <div class="content">
        <i class="icons">
          <i class="calendar icon"></i>
          <i class="corner left arrow icon"></i>
        </i>
        <div ng-class="{green: budzet.meta.fromStart >= 0, red: budzet.meta.fromStart < 0}" class="ui large horizontal label">
          {{ budzet.start }}
        </div>
      </div>
    </div>
    <div ng-if="budzet.min && budzet.min !== '0.00'" class="item">
      <div class="content">
        <i class="icons">
          <i class="money icon"></i>
          <i class="corner play icon"></i>
        </i>
        <div ng-class="{green: budzet.meta.toMin <= 0, red: budzet.meta.toMin > 0}" class="ui large horizontal label">
          {{ budzet.min | round2 }}
        </div>
      </div>
    </div>
    <div ng-if="budzet.stop" class="item">
      <div class="content">
        <i class="icons">
          <i class="calendar icon"></i>
          <i class="corner right arrow icon"></i>
        </i>
        <div ng-class="{green: budzet.meta.tillStop >= 0, red: budzet.meta.tillStop < 0}" class="ui large horizontal label">
          {{ budzet.stop }}
        </div>
      </div>
    </div>
    <div ng-if="budzet.max && budzet.max !== '0.00'" class="item">
      <div class="content">
        <i class="icons">
          <i class="money icon"></i>
          <i class="corner pause icon"></i>
        </i>
        <div ng-class="{green: budzet.meta.toMax >= 0, red: budzet.meta.toMax < 0}" class="ui large horizontal label">
          {{ budzet.max | round2 }}
        </div>
      </div>
    </div>
  </div>
  <div class="ui divider"></div>
  -->
  <!-- OSTATNIE OPERACJE -->
  <div ng-if="!operacjeLista.length" class="ui teal message">
    Brak dokonanych operacji na budżecie
  </div>
  <div ng-if="operacjeLista.length">
    <table class="ui celled striped compact inverted table">
      <thead>
        <tr>
          <th>Operacja</th>
          <th>Data</th>
          <th>Kwota</th>
        </tr>
      </thead>
      <tbody>
        <tr ng-repeat="n in operacjeLista">
          <td><i ng-class="{ 'in': n.rodzaj === 'Przychód', 'out': n.rodzaj === 'Wydatek' }" class="big sign icon"></i>{{ n.rodzaj }}</td>
          <td>{{ n.data }}</td>
          <td><span ng-if="n.rodzaj==='Wydatek'">- </span>{{ n.kwota }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>