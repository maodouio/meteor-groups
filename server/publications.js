// FRIENDS INDEX
// -------------------------------------------------------
Meteor.publish('groups', function() {
  return Groups.find();
});

// FRIEND SHOW
// -------------------------------------------------------
Meteor.publish('group', function(id) {
  return Groups.find(id);
});
