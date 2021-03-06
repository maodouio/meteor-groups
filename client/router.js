// ***************************************************************
// ROUTES (Groups)
// ***************************************************************

let groupsController = RouteController.extend({
  onBeforeAction: function() {
    let user = Meteor.user();
    if (user && user.username) {
      this.next();
    } else {
      this.render("layoutHeader", {
        to: "layoutHeader"
      });
      this.render("layoutFooter", {
        to: "layoutFooter"
      });
      this.render("unauthorized");
    }
  },
  yieldTemplates: {
    layoutHeader: {
      to: "layoutHeader"
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
    path: '/groups'
  });

  this.route('groupShow', {
    controller: groupsController,
    template: 'groupShow',
    path: '/groups/:_id',
    waitOn: function () {
      return ReactionCore.subsManager.subscribe('group', this.params._id);
    },
    data: function () {
      return Groups.findOne(this.params._id);
    }
  });

  //加入group
  this.route('groupNew', {
    controller: groupsController,
    template: 'groupNew',
    path: '/groupNew'
  });

  this.route('groupCreate', {
    controller: groupsController,
    template: 'groupCreate',
    path: '/groupCreate'
  });

  this.route('groupEdit', {
    controller: groupsController,
    template: 'groupEdit',
    path: '/groupEdit/:_id',
    waitOn: function() {
      return ReactionCore.subsManager.subscribe('group', this.params._id);
    },
    data: function () {
      return Groups.findOne(this.params._id);
    },
    action: function () {
      var user = Meteor.user();
      var group = Groups.findOne(this.params._id);
      if (user && (Roles.userIsInRole(user, "admin") || user._id === group.ownerId)) {
        return this.render();
      } else {
        return Router.go("/groups");
      }
    }
  });
});
