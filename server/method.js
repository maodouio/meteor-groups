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
    console.log("joinGroup is running...");
    var userId = Meteor.userId();

    // 判断群组是否存在
    var result = Groups.findOne({_id: groupId});
    if (!result) {
      console.log("GroupId is not exists, groupId =", groupId);
      return false;
    }

    // 判断是否已经加入过群组
    for (var i = 0; i < result.memberIds.length; i++) {
      if (result.memberIds[i] == userId) {
        console.log("userId already exists, userId =", userId);
        return false;
      }
    }

    // 将成员加入数组
    var arrMember = result.memberIds;
    console.log("Group Member Array Info:", arrMember);
    arrMember.push(userId);
    console.log("Push User to Group MemberIds", arrMember);

    // 更新数据库
    Groups.update(result._id, {$set:{memberIds: arrMember}});
    console.log("Add User in Group, userId =", userId);
  },
  leaveGroup: function(groupId) {
    console.log("leaveGroup is runnning...");
    var userId = Meteor.userId();

    // 判断群组id是否存在
    var result = Groups.findOne({_id: groupId});
    if (!result) {
      console.log("GroupId is not exists:", groupId);
      return false;
    }
    if (result.ownerId === userId) {
      console.log("You can't leave this group you are owner:", groupId);
      return false;
    } else {
      // 遍历数组删除用户
      var arrMember = result.memberIds;
      console.log("Group Member Array Info:", arrMember);
      for (var i = 0; i < arrMember.length; i++) {
        if (arrMember[i] == userId) {
          arrMember.splice(i, 1);
          console.log("Delete value:", i, arrMember[i]);
        }
      }
      // update
      Groups.update(result._id, {$set:{memberIds: arrMember}});
      console.log("pop user from Group", userId, groupId);
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
  }
});
