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
  <div class="ui two columns center aligned stackable grid">
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
      
      <div ng-if="!opcjaDodajWydatek && !opcjaDodajPrzyplyw && !opcjaWykonajTransfer" class="three ui buttons">
        <a ng-click="wydatekDodajToggle()" class="focusTrigger ui big yellow button"><i class="minus icon"></i>Wydatek</a>
        <a ng-click="przyplywDodajToggle()" class="focusTrigger ui big button"><i class="plus icon"></i>Przypływ</a>
        <a ng-if="budzetLista.length > 0" ng-click="transferWykonajToggle()" class="focusTrigger ui big button"><i class="exchange icon"></i>Transfer</a>
      </div>
      
      <div ng-if="opcjaDodajWydatek" class="ui inverted segment">
        <h2 class="ui header">Wydatek</h2>
        <form ng-submit="wydatekDodaj( wydatek.kwota, budzet.ID )" class="ui inverted form" method="POST">
          <div class="field">
            <label for="id_przychod_kwota">Podaj wydaną kwotę:</label>
            <input ng-model="wydatek.kwota" id="id_wydatek_kwota" class="focus" type="number" min="0.01" max="9999999999999.99" step="0.01" />
          </div>
          <div class="field">
            <div class="ui large buttons">
              <button type="submit" class="ui olive button"><i class="minus icon"></i>Wydaj</button>
              <div class="or" data-text="lub"></div>
              <a ng-click="wydatekDodajToggle()" class="blurTrigger ui grey button">Anuluj</a>
            </div>
          </div>
        </form>
      </div>
      <div ng-if="opcjaDodajPrzyplyw" class="ui inverted segment">
        <h2 class="ui header">Przypływ</h2>
        <form ng-submit="przychodDodaj( przychod.kwota, budzet.ID )" class="ui inverted form" method="POST">
          <div class="field">
            <input ng-model="przychod.kwota" id="id_przychod_kwota" class="focus" type="number" min="0.01" max="9999999999999.99" step="0.01" placeholder="Wpisz kwotę"/>
          </div>
          <div class="field">
            <div class="ui large buttons">
              <button type="submit" class="ui olive button"><i class="plus icon"></i>Dodaj</button>
              <div class="or" data-text="lub"></div>
              <a ng-click="przyplywDodajToggle()" class="blurTrigger ui grey button">Anuluj</a>
            </div>
          </div>
        </form>
      </div>
      <div ng-if="opcjaWykonajTransfer && budzetLista.length > 0" class="ui inverted segment">
        <h2 class="ui header">Transfer</h2>
        <form ng-submit="transferWykonaj( transfer, budzet.ID )" method="POST" class="ui inverted inline form">
          <div class="two fields">
            <div class="field">
              <input ng-model="transfer.kwota" id="id_transfer_kwota" class="focus" type="number" min="0.01" max="9999999999999.99" step="0.01" placeholder="Wpisz kwotę"/>
            </div>
            <div class="field">
              <label for="id_przychod_kwota">Wskaż docelowy budżet:</label>
              <select ng-model="transfer.biorcaID" placeholder="Wybierz budżet">
                <option value="">wybierz budżet</option>
                <option ng-repeat="n in budzetLista" value="{{ n.ID }}">
                  {{ n.nazwa }}
                </option>
              </select>
            </div>
          </div>
          <div class="field">
            <div class="ui large  buttons">
              <button type="submit" class="ui olive button"><i class="exchange icon"></i>Wykonaj</button>
              <div class="or" data-text="lub"></div>
              <a ng-click="transferWykonajToggle()" class="blurTrigger ui grey button">Anuluj</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div ng-include src="'/tpl/parts/message.tpl'"></div>
  <div class="ui divider"></div>
  
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
          <td><i ng-class="{ 'in': n.OPERACJA_TYP_ID === '2', 'out': n.OPERACJA_TYP_ID === '1' }" class="big sign icon"></i>{{ n.rodzaj }}</td>
          <td>{{ n.data }}</td>
          <td><span ng-if="n.OPERACJA_TYP_ID==='1'">- </span>{{ n.kwota }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>