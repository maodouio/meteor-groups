// GROUP INDEX
// -------------------------------------------------------
Meteor.publish('groups', function() {
  return Groups.find({memberIds: {$in: [this.userId]}});
});

// GROUP SHOW
// -------------------------------------------------------
Meteor.publish('group', function(groupId) {
  check(groupId, String);
  return Groups.find(groupId);
});
// GROUP NEW
// -------------------------------------------------------
Meteor.publish('allGroups', function() {
  return Groups.find();
});
