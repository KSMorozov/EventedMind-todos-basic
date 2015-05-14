Todos = new Meteor.Collection('todos');

Meteor.isClient ? (function() {
  todoSub = Meteor.subscribe('todos');

  Template.todosPanel.helpers({
    items: function() {
      return Todos.find({}, {
        sort: {
          created_at: -1
        }
      });
    },

    isDoneClass: function() {
      return this.is_done ? 'done' : '';
    }
  });

  Template.todoItem.helpers({
    isDoneChecked: function() {
      return this.is_done ? 'checked' : '';
    }
  });

  Template.todosCount.helpers({
    completedCount: function() {
      return Todos.find({is_done: true}).count();
    },

    totalCount: function() {
      return Todos.find().count();
    }
  });

  Template.todoItem.events({
    'click [name=is_done]': function(e, template) {
      var id = this._id;
      var isDone = template.find('input').checked;
      Todos.update({_id: id}, {
        $set: {
          is_done: isDone
        }
      });
    }
  });

  Template.createTodoItem.events({
    'submit form': function(e, template) {
      e.preventDefault();

      var subject = template.find('input').value;

      Todos.insert({
        subject: subject,
        created_at: new Date,
        is_done: false,
        user_id: Meteor.userId()
      });

      var form = template.find('form');
      form.reset();
    }
  });
}()) : (function() {
  Meteor.publish('todos', function() {
    return Todos.find({user_id: this.userId});
  });

  Todos.allow({
    insert: function(userId, doc) {
      return userId;
    },

    update: function(userId, doc, fieldNames, modifier) {
      return doc.user_id === userId;
    },

    remove: function() {
      return doc.user_id === userId;
    }
  });

}());
