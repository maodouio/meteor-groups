// ***************************************************************
// ROUTES (Groups)
// ***************************************************************

Router.map(function() {
  this.route('groupsIndex', {
    controller: ShopController,
    template: 'groupsIndex',
    path: '/groups',
    waitOn: function () {
      return Meteor.subscribe('groups');
    },
    data: {
      groups: function () {
        return Groups.find({}, {sort: {createdAt: -1}});
      }
    }
  });

  this.route('groupShow', {
    controller: ShopController,
    template: 'groupShow',
    path: '/groups/:_id',
    waitOn: function () {
      return Meteor.subscribe('group', this.params._id);
    },
    data: function () {
      return Groups.findOne(this.params._id);
    }
  });

  //加入group
  this.route('groupNew', {
    controller: ShopController,
    template: 'groupNew',
    path: '/groupNew',
    waitOn: function () {
      return Meteor.subscribe('allGroups');
    },
    data: function () {
      return Groups.find();
    }
  });

  this.route('groupCreate', {
    controller: ShopController,
    template: 'groupCreate',
    path: '/groupCreate'
  });
});
