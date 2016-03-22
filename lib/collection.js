// ***************************************************************
// GROUPS COLLECTION
// ***************************************************************

Groups = new Meteor.Collection('groups');

GroupSchema = new SimpleSchema({
  avatarId: {
    type: String,
    optional: true
  },
  ownerId: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.userId();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: Meteor.userId()
        };
      } else {
        this.unset();
      }
    },
    denyUpdate: true
  },
  groupName: {
    type: String
  },
  description: {
    type: String,
    autoform: {
      rows: 4
    },
    optional: true
  },
  memberIds: {
    type: [String],
    optional: true
  },
  membersCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  articles: {
    type: [Object],
    optional: true,
    blackbox: true
  },
  articlesCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  createdAt: {
    type: Date,
    optional: true,
    denyUpdate: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  updatedAt: {
    type: Date,
    optional: true,
    denyInsert: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    }
  }
});

// Must remember to attach the schema to the collection
Groups.attachSchema(GroupSchema);

// Custom validation messages with SimpleSchema. Remove if not needed
Groups.simpleSchema().messages({
  required: "[label] is required",
  minString: "[label] must be at least [min] characters",
  maxString: "[label] cannot exceed [max] characters",
  minNumber: "[label] must be at least [min]",
  maxNumber: "[label] cannot exceed [max]",
  minDate: "[label] must be on or before [min]",
  maxDate: "[label] cannot be after [max]",
  minCount: "You must specify at least [minCount] values",
  maxCount: "You cannot specify more than [maxCount] values",
  noDecimal: "[label] must be an integer",
  notAllowed: "[value] is not an allowed value",
  expectedString: "[label] must be a string",
  expectedNumber: "[label] must be a number",
  expectedBoolean: "[label] must be a boolean",
  expectedArray: "[label] must be an array",
  expectedObject: "[label] must be an object",
  expectedConstructor: "[label] must be a [type]",
  regEx: [
  {msg: "[label] failed regular expression validation"},
  {exp: SimpleSchema.RegEx.Email, msg: "[label] must be a valid e-mail address"},
  {exp: SimpleSchema.RegEx.WeakEmail, msg: "[label] must be a valid e-mail address"},
  {exp: SimpleSchema.RegEx.Domain, msg: "[label] must be a valid domain"},
  {exp: SimpleSchema.RegEx.WeakDomain, msg: "[label] must be a valid domain"},
  {exp: SimpleSchema.RegEx.IP, msg: "[label] must be a valid IPv4 or IPv6 address"},
  {exp: SimpleSchema.RegEx.IPv4, msg: "[label] must be a valid IPv4 address"},
  {exp: SimpleSchema.RegEx.IPv6, msg: "[label] must be a valid IPv6 address"},
  {exp: SimpleSchema.RegEx.Url, msg: "[label] must be a valid URL"},
  {exp: SimpleSchema.RegEx.Id, msg: "[label] must be a valid alphanumeric ID"}
  ],
  keyNotInSchema: "[label] is not allowed by the schema"
});

 //Allow and deny rules
Groups.allow({
  insert: function (userId, doc) {
    // Free-for-all!
    return true;
  },
  update: function(userId, doc, fields, modifier) {
    var adminId = Meteor.users.findOne({
      'roles.__global_roles__': {
        $elemMatch: {
          $eq: 'admin'
        }
      }
    })._id;
    return (userId && doc.ownerId === userId || userId === adminId);
  },
  remove: function(userId, doc) {
    var adminId = Meteor.users.findOne({
      'roles.__global_roles__': {
        $elemMatch: {
          $eq: 'admin'
        }
      }
    })._id;
    return (userId && doc.ownerId === userId || userId === adminId);
  }
});

// Meteor methods related to collection
Meteor.methods({
  // someMethod: function(arg1, arg2) {
  //   return "some return value";
  // },
});
