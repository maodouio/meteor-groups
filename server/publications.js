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
// GROUP AVATAR
// -------------------------------------------------------
Meteor.publish('groupAvatarId', function(id) {
  check(id, String);
  var Media = ReactionCore.Collections.Media;
  return Media.find({"metadata.groupAvatarId": id});
});
// ALL GROUPS AVATAR
// -------------------------------------------------------
Meteor.publish('groupsMedia', function() {
  var Media = ReactionCore.Collections.Media;
  return Media.find({"metadata.groupAvatarId": {$exists: true}});
});
