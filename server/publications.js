// FRIENDS INDEX
// -------------------------------------------------------
Meteor.publish('groups', function(userId) {
  return Groups.find({memberIds: {$in: [userId]}});
});

// FRIEND SHOW
// -------------------------------------------------------
Meteor.publish('group', function(groupId) {
  return Groups.find(groupId);
});
