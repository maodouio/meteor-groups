// ***************************************************************
// ROUTES (Groups)
// ***************************************************************

Router.map(function() {
  this.route('groupsIndex', {
    template: 'groupsIndex',
    path: '/userGroups/:_id',
    waitOn: function () {
      return Meteor.subscribe('groups', this.params._id);
    },
    data: {
      groups: function () {
        return Groups.find({}, {sort: {createdAt: -1}});
      }
    }
  });

  this.route('groupShow', {
    template: 'groupShow',
    path: '/groups/:_id',
    waitOn: function () {
      return Meteor.subscribe('group', this.params._id);
    },
    data: function () {
      return Groups.findOne(this.params._id);
    }
  });
});
