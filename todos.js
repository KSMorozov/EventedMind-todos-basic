Todos = new Meteor.Collection('todos');

Meteor.isClient ? (function() {
  Template.todosPanel.helpers({
    items: function() {
      return Todos.find();
    }
  });
}()) : (function() {

}());
