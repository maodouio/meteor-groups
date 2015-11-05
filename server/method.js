Meteor.methods({
  createGroup: function(groupName) {
    ownerId = Meteor.userId();
    console.log("createGroup function running, ownerId =", ownerId);

    var arrMember = [];

    var groupId = Groups.insert({
      ownerId: ownerId,
      groupName: groupName,
      memberIds: arrMember,
      createdAt: new Date()
    });

    return groupId;
  },
  joinGroup: function(groupId) {
    userId = Meteor.userId();
    console.log("joinGroup is running...");

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
    userId = Meteor.userId();
    console.log("leaveGroup is runnning...");

    // 判断群组id是否存在
    var result = Groups.findOne({_id: groupId});
    if (!result) {
      console.log("GroupId is not exists:", groupId);
      return false;
    }

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
  },
  deleteGroup: function(groupId) {
    console.log("deleteGroup is running...");

    // 判断群组id是否存在
    var result = Groups.findOne({_id: groupId});
    if (!result) {
      console.log("GroupId is not exists:", groupId);
      return false;
    }
    // remove
    Groups.remove({_id: groupId});
    console.log("Remove Group:", groupId);
  }
});
