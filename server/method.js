Meteor.methods({
  createGroup: function(groupName) {
    var ownerId = Meteor.userId();
    console.log("createGroup function running, ownerId =", ownerId);
    result = Groups.findOne({groupName: groupName});
    if (result) {
      console.log("GroupName is exists");
      return false;
    }
    var arrMember = [ownerId];

    var groupId = Groups.insert({
      ownerId: ownerId,
      groupName: groupName,
      memberIds: arrMember,
      createdAt: new Date()
    });

    return groupId;
  },
  joinGroup: function(groupId) {
    check(groupId, String);

    var userId = Meteor.userId();
    if (!userId) {
      return false;
    }

    var result = Groups.findOne({_id: groupId});
    if (!result) {
      return false;
    }

    for (var i = 0; i < result.memberIds.length; i++) {
      if (result.memberIds[i] == userId) {
        return false;
      }
    }

    // join group
    var arrMember = result.memberIds;
    arrMember.push(userId);

    // membersCount
    var membersCount = result.membersCount || 0

    // update
    return Groups.update(
      result._id, {
        $set: {
          memberIds: arrMember,
          membersCount: membersCount + 1
        }
      }
    );
  },
  leaveGroup: function(groupId) {
    check(groupId, String);
    var userId = Meteor.userId();

    var result = Groups.findOne({_id: groupId});
    if (!result) {
      return false;
    }
    if (result.ownerId === userId) {
      throw new Meteor.Error(403, 'You can\'t leave this group because you are owner');
      return false;
    } else {
      // delete user
      var arrMember = result.memberIds;
      var memberCount = result.memberCount;

      for (var i = 0; i < arrMember.length; i++) {
        if (arrMember[i] == userId) {
          arrMember.splice(i, 1);
          memberCount = memberCount - 1;
        }
      }

      // update
      return Groups.update(result._id, {$set:{memberIds: arrMember, memberCount: memberCount}});
    }

  },
  removeGroup: function(groupId) {
    console.log("removeGroup is running...");
    var userId = Meteor.userId();

    // 判断群组id是否存在
    var result = Groups.findOne({_id: groupId});
    if (!result) {
      console.log("GroupId is not exists:", groupId);
      return false;
    }

    // 判断用户是否有删除组的权限
    if (result.ownerId === userId) {
      // remove
      Groups.remove({_id: groupId});
      console.log("Remove Group:", groupId);
    } else {
      console.log("You are not this group owner:", groupId);
      return false;
    }
  },
  isOwner: function(userId, groupId) {
    // 判断群组id是否存在
    var result = Groups.findOne({_id: groupId});
    if (!result) {
      console.log("GroupId is not exists:", groupId);
      return false;
    }
    if (result.ownerId === userId) {
      return true;
    } else {
      return false;
    }
  },
  isInGroup: function(userId, groupId) {
    check(userId, String);
    check(groupId, String);
    var result = Groups.findOne({_id: groupId});
    if (!result) {
      console.log("GroupId is not exists:", groupId);
      return false;
    }
    if(_.contains(result.memberIds, userId)) {
      return true;
    } else {
      return false;
    }
  },
  removeMember: function(memberId, groupId) {

    // 判断群组id是否存在
    var result = Groups.findOne({_id: groupId});
    if (!result) {
      console.log("GroupId is not exists:", groupId);
      return false;
    }

    // 判断是否是群主
    if (!(result.ownerId === Meteor.userId())) {
      return false;
    }

    if (result.ownerId === memberId) {
      console.log("You can't leave this group you are owner:", groupId);
      return false;
    } else {
      // 遍历数组删除用户
      var arrMember = result.memberIds;
      console.log("Group Member Array Info:", arrMember);
      for (var i = 0; i < arrMember.length; i++) {
        if (arrMember[i] == memberId) {
          arrMember.splice(i, 1);
          console.log("Delete value:", i, arrMember[i]);
        }
      }
      // update
      Groups.update(result._id, {$set:{memberIds: arrMember}});
      console.log("pop user from Group", memberId, groupId);
    }
  },
  groupInfo: function (groupId) {
    check(groupId, String);
    return Groups.findOne({_id: groupId});
  }
});
