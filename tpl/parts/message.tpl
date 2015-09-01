<div class="ui green message" ng-if="message.success">
  <img class="ui mini avatar image" src="/img/matthew.png"> <i>Matthew:</i> <strong>&mdash; {{ message.success }}</strong>
</div>
<div class="ui red message" ng-if="message.error">
  <img class="ui mini avatar image" src="/img/matthew.png"> <i>Matthew:</i> <strong>&mdash; {{ message.error }}</strong>
</div>
<div class="ui orange message" ng-if="message.danger">
  <img class="ui mini avatar image" src="/img/lucy.png"> <i>Lucy:</i> <strong>&mdash; {{ message.danger }}</strong>
</div>
<div class="ui teal message" ng-if="message.info">
  <img class="ui mini avatar image" src="/img/lucy.png"> <i>Lucy:</i> <strong>&mdash; {{ message.info }}</strong>
</div>