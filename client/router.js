// ***************************************************************
// ROUTES (Groups)
// ***************************************************************

let groupsController = RouteController.extend({
  onBeforeAction: function () {
    if (!ReactionCore.hasPermission('account/profile')) {
      this.render("layoutHeader", {
        to: "layoutHeader"
      });
      this.render("layoutFooter", {
        to: "layoutFooter"
      });
      this.render("unauthorized");
    } else {
      this.next();
    }
  },
  yieldTemplates: {
    layoutHeader: {
      to: "layoutHeader"
    },
    layoutFooter: {
      to: "layoutFooter"
    },
    dashboard: {
      to: "dashboard"
    }
  }
});

this.groupsController = groupsController;

Router.map(function() {
  this.route('groupsIndex', {
    controller: groupsController,
    template: 'groupsIndex',
    path: '/groups',
    waitOn: function () {
      return [
        Meteor.subscribe('groups'),
        Meteor.subscribe('authors'),
        Meteor.subscribe('articles'),
        Meteor.subscribe("Images")
      ];
    },
    data: {
      groups: function () {
        return Groups.find({}, {sort: {createdAt: -1}});
      }
    }
  });

  this.route('groupShow', {
    controller: groupsController,
    template: 'groupShow',
    path: '/groups/:_id',
    waitOn: function () {
      return [
        Meteor.subscribe('group', this.params._id),
        Meteor.subscribe('authors'),
        Meteor.subscribe('articles'),
        Meteor.subscribe("Images")
      ];
    },
    data: function () {
      return Groups.findOne(this.params._id);
    }
  });

  //加入group
  this.route('groupNew', {
    controller: groupsController,
    template: 'groupNew',
    path: '/groupNew',
    waitOn: function () {
      return [
        Meteor.subscribe('allGroups'),
        Meteor.subscribe("Images"),
        Meteor.subscribe('authors'),
        Meteor.subscribe('articles'),
      ];
    },
    data: function () {
      return Groups.find();
    }
  });

  this.route('groupCreate', {
    controller: groupsController,
    template: 'groupCreate',
    path: '/groupCreate',
    subscriptions: function () {
      return [
        this.subscribe('authors'),
        Meteor.subscribe("Images"),
        Meteor.subscribe('friends')
      ];
    }
  });

  this.route('groupEdit', {
    controller: groupsController,
    template: 'groupEdit',
    path: '/groupEdit/:_id',
    subscriptions: function() {
      return [
        Meteor.subscribe('group', this.params._id),
        this.subscribe('authors'),
        Meteor.subscribe("Images"),
        Meteor.subscribe('friends')
      ];
    },
    data: function () {
      return Groups.findOne(this.params._id);
    }
  });
});
