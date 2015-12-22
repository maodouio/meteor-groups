// FRIENDS INDEX
// -------------------------------------------------------
Meteor.publish('groups', function() {
  return Groups.find({memberIds: {$in: [this.userId]}});
});

// FRIEND SHOW
// -------------------------------------------------------
Meteor.publish('group', function(groupId) {
  return Groups.find(groupId);
});
