// GROUP INDEX
// -------------------------------------------------------
Meteor.publish('groups', function() {
  return Groups.find({memberIds: this.userId});
});

Meteor.publish('groupsForArticle', function(articleId) {
  check(articleId, String);
  let orQuery = [];
  let article = Articles.findOne(articleId);
  if (article) {
    if (this.userId === article.authorId) {
      orQuery.push({
        "memberIds": this.userId
      });
    } else {
      orQuery.push({
        "memberIds": {
          "$in" : [
            this.userId,
            article.authorId
          ]
        }
      });
    }

    if (article.groupIds) {
      orQuery.push({
        "_id": {
          "$in": article.groupIds
        }
      });
    }
  }
  return Groups.find({$or: orQuery});
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
  return Images.find({"metadata.groupAvatarId": id});
});
// ALL GROUPS AVATAR
// -------------------------------------------------------
Meteor.publish('groupsMedia', function() {
  return Images.find({"metadata.groupAvatarId": {$exists: true}});
});

Meteor.publish('groupImages', function(groupIds) {
  check(groupIds, Array);
  let avatarIds = [];
  let groups = Groups.find({
    "_id": {
      $in: groupIds
    }
  }).fetch();

  _.each(groups, function (group) {
    avatarIds.push(group.avatarId);
  });

  return Images.find({
    "metadata.groupAvatarId": {
      $in: avatarIds
    }
  });
});

Meteor.publish('groups/members', function(memberIds) {
  check(memberIds, Match.OptionalOrNull(Array));
  if (memberIds) {
      selector = {
          _id: {
              $in: memberIds
          }
      };
  }

  return Meteor.users.find(selector, {
      fields: {
          _id: 1,
          username: 1,
          emails: 1,
          profile: 1
      }
  });
});


