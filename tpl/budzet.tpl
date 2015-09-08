<div ng-if="!opcjaDodajBudzet" class="ui buttons">
  <a class="ui yellow basic button" ng-click="dodajBudzetToggle()"><i class="plus icon"></i>Dodaj budżet</a>
</div>
<div ng-switch on="opcjaDodajBudzet">
  <div ng-switch-when="true">
    <form class="ui form" ng-submit="budzetDodaj( $event, budzet )" method="POST">
      <div class="field">
        <h3 class="ui header">Nowy budżet</h3>
        <input ng-model="budzet.nazwa" id="id_budzet_nazwa" name="budzet_nazwa" type="text" placeholder="Nazwa nowego budżetu"/>
      </div>
      <div ng-if="opcjaDodajBudzet" class="ui buttons">
        <button type="submit" class="ui olive button"><i class="plus icon"></i>Dodaj</button>
        <div class="or" data-text="lub"></div>
        <a ng-click="dodajBudzetToggle()" class="ui grey button">Anuluj</a>
      </div>
    </form>
    <div ng-include src="'/tpl/parts/message.tpl'"></div>
  </div>
</div>
<div class="ui divider"></div>

<div ng-if="budzetLista.length" class="ui container">
  <div class="ui stackable two column grid">
    <div ng-repeat="n in budzetLista" class="column">
        <div class="ui segments">
          <div class="ui segment">
            <h2 class="ui centered block header">
              <a ng-href="#/budzet/{{ n.ID }}">{{ n.nazwa }}
                <!-- <span class="ui tiny label">{{ n.meta.percentage }}% wszystkich</span> -->
              </a>
            </h2>
            <div class="ui three column center aligned grid">
              <div focusable-directive class="three wide column">
              <!-- 
                <div class="ui buttons">
                  <a ng-click="wydatekDodajToggle()" ng-show="!opcjaDodajWydatek" class="focusTrigger ui yellow icon button"><i class="minus icon"></i></a>
                </div>
                <form ng-submit="wydatekDodaj( wydatek.kwota, budzet.ID )" ng-show="opcjaDodajWydatek" class="ui form" method="POST">
                  <div ng-class="{ 'active': loadingWydatekDodaj }" class="ui dimmer">
                    <div class="ui text loader">Wypłacam...</div>
                  </div>
                  <div class="ui tiny buttons">
                    <button type="submit" class="ui olive button"><i class="minus icon"></i>Wydaj</button>
                    <div class="or" data-text="lub"></div>
                    <a ng-click="wydatekDodajToggle()" class="blurTrigger ui grey button">Anuluj</a>
                  </div>
                  <div class="field">
                    <input ng-model="wydatek.kwota" id="id_wydatek_kwota" class="focus" type="number" min="0.01" max="9999999999999.99" step="0.01" />
                  </div>
                </form>
              -->
              </div> 
              <div class="ten wide column">
                <div class="ui tiny statistic">
                  <div class="value">
                    {{ n.kwota }}
                  </div>
                  <div class="label">
                    jednostek
                  </div>
                </div>
              </div>
              <div focusable-directive class="three wide column">
                <!--
                <div class="ui buttons">
                  <a ng-click="przyplywDodajToggle()" ng-show="!opcjaDodajPrzyplyw" class="focusTrigger ui yellow icon button"><i class="plus icon"></i></a>
                </div>  
                <form ng-submit="przychodDodaj( przychod.kwota, budzet.ID )" ng-show="opcjaDodajPrzyplyw" class="ui form" method="POST">
                  <div ng-class="{ 'active': loadingPrzychodDodaj }" class="ui dimmer">
                    <div class="ui text loader">Lokuję...</div>
                  </div>
                  <div class="field ui tiny buttons">
                    <button type="submit" class="ui olive button"><i class="plus icon"></i>Dodaj</button>
                    <div class="or" data-text="lub"></div>
                    <a ng-click="przyplywDodajToggle()" class="blurTrigger ui grey button">Anuluj</a>
                  </div>
                  <div class="field">
                    <input ng-model="przychod.kwota" id="id_przychod_kwota" class="focus" type="number" min="0.01" max="9999999999999.99" step="0.01" />
                  </div>
                </form>
              -->
              </div>
            </div>
            <div ng-if="n.meta.isEmpty" class="ui teal message">
              Brak specjalnych warunków
            </div>
            <div ng-if="!n.meta.isEmpty" class="ui big list">
              <div ng-if="n.start" class="item">
                <div class="content">
                  <i class="icons">
                    <i class="calendar icon"></i>
                    <i class="corner left arrow icon"></i>
                  </i>
                  <div class="ui large horizontal label">Start 
                    <div class="detail">{{ n.start }}</div>
                  </div>
                  <div ng-if="n.meta.fromStart >= 0" class="ui green horizontal label">{{ n.meta.fromStart }} dni temu</div>
                  <div ng-if="n.meta.fromStart < 0" class="ui red horizontal label">za {{ n.meta.fromStart | abs }} dni</div>
                </div>
              </div>
              <div ng-if="n.min && n.min !== '0.00'" class="item">
                <div class="content">
                  <i class="icons">
                    <i class="money icon"></i>
                    <i class="corner play icon"></i>
                  </i>
                  <div class="ui large horizontal label">Min 
                    <div class="detail">{{ n.min }}</div>
                  </div>
                  <div ng-if="n.meta.toMin <= 0" class="ui green horizontal label">zapas {{ n.meta.toMin | round2 | abs }}%</div>
                  <div ng-if="n.meta.toMin > 0" class="ui red horizontal label">brakuje {{ n.meta.toMin | round2 }}%</div>
                </div>
              </div>
              <div ng-if="n.stop" class="item">
                <div class="content">
                  <i class="icons">
                    <i class="calendar icon"></i>
                    <i class="corner right arrow icon"></i>
                  </i>
                  <div class="ui large horizontal label">Stop 
                    <div class="detail">{{ n.stop }}</div>
                  </div>
                  <div ng-if="n.meta.tillStop >= 0" class="ui green horizontal label">za {{ n.meta.tillStop }} dni</div>
                  <div ng-if="n.meta.tillStop < 0" class="ui red horizontal label">spóźnienie {{ n.meta.tillStop | abs }} dni</div>
                </div>
              </div>
              <div ng-if="n.max && n.max !== '0.00'" class="item">
                <div class="content">
                  <i class="icons">
                    <i class="money icon"></i>
                    <i class="corner pause icon"></i>
                  </i>
                  <div class="ui large horizontal label">Max 
                    <div class="detail">{{ n.max }}</div>
                  </div>
                  <div ng-if="n.meta.toMax >= 0" class="ui green horizontal label">{{ n.meta.toMax | round2 }}% wolne</div>
                  <div ng-if="n.meta.toMax < 0" class="ui red horizontal label">nadwyżka {{ n.meta.toMax | round2 | abs }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</div>