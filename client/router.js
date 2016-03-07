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
        ReactionCore.subsManager.subscribe('groups'),
        ReactionCore.subsManager.subscribe('authors'),
        // ReactionCore.subsManager.subscribe('articles'),
        ReactionCore.subsManager.subscribe("Images")
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
        ReactionCore.subsManager.subscribe('group', this.params._id),
        ReactionCore.subsManager.subscribe('authors'),
        ReactionCore.subsManager.subscribe('articles'),
        ReactionCore.subsManager.subscribe("Images")
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
        ReactionCore.subsManager.subscribe('allGroups'),
        ReactionCore.subsManager.subscribe("Images"),
        ReactionCore.subsManager.subscribe('authors'),
        ReactionCore.subsManager.subscribe('articles'),
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
        ReactionCore.subsManager.subscribe('authors'),
        ReactionCore.subsManager.subscribe("Images"),
        ReactionCore.subsManager.subscribe('friends')
      ];
    }
  });

  this.route('groupEdit', {
    controller: groupsController,
    template: 'groupEdit',
    path: '/groupEdit/:_id',
    subscriptions: function() {
      return [
        ReactionCore.subsManager.subscribe('group', this.params._id),
        ReactionCore.subsManager.subscribe('authors'),
        ReactionCore.subsManager.subscribe("Images"),
        ReactionCore.subsManager.subscribe('friends')
      ];
    },
    data: function () {
      return Groups.findOne(this.params._id);
    }
  });
});
