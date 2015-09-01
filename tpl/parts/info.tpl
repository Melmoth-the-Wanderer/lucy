<div class="ui green message" ng-if="info.success">
  <img class="ui mini avatar image" src="/img/matthew.png"> <i>Matthew:</i> <strong>&mdash; {{ info.success }}</strong>
</div>
<div class="ui red message" ng-if="info.error">
  <img class="ui mini avatar image" src="/img/matthew.png"> <i>Matthew:</i> <strong>&mdash; {{ info.error }}</strong>
</div>
<div class="ui orange message" ng-if="info.danger">
  <img class="ui mini avatar image" src="/img/lucy.png"> <i>Lucy:</i> <strong>&mdash; {{ info.danger }}</strong>
</div>
<div class="ui teal message" ng-if="info.info">
  <img class="ui mini avatar image" src="/img/lucy.png"> <i>Lucy:</i> <strong>&mdash; {{ info.info }}</strong>
</div>

<br />