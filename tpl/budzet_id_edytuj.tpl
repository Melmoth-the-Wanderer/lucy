<a ng-href="#budzet/{{ budzet.ID }}" class="ui small basic grey button"><i class="step backward icon"></i>Budżet</a>
<a href="#budzet" class="ui small basic grey button"><i class="backward icon"></i>Lista budżetów</a>


<div class="ui divider"></div>
<div class="ui container">
  <form ng-submit="budzetEdytuj( $event, budzet )" class="ui form" method="POST">
    <div class="ui two column stackable grid">
      <div class="column">
        <div class="field">
          <label>Od (format daty RRR-MM-DD):</label>
          <div class="ui left icon input">
            <input ng-model="budzet.start" type="date" name="data_od" placeholder="niezdefiniowano"/>
            <i class="calendar icon"></i>
          </div>
        </div>
        <div class="field">
          <label>Min:</label>
          <div class="ui left icon input">
            <input ng-model="budzet.min" type="number" name="min" min="0.00" max="9999999999999.98" step="0.01" placeholder="niezdefiniowano" />
            <i class="money icon"></i>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <label>Do (format daty RRR-MM-DD):</label>
          <div class="ui left icon input">
            <input ng-model="budzet.stop" type="date" name="data_do" placeholder="niezdefiniowano"/>
            <i class="calendar icon"></i>
          </div>
        </div>
        <div class="field">
          <label>Max:</label>
          <div class="ui left icon input">
            <input ng-model="budzet.max" type="number" name="max" min="0.01" max="9999999999999.99" step="0.01" placeholder="niezdefiniowano" />
            <i class="money icon"></i>
          </div>
        </div>
      </div>
      <input ng-model="budzet.ID" type="hidden" name="ID"/>
      <button class="ui big fluid violet button">Zapisz i pokaż budżet</button>
    </div>
  </form>
</div>