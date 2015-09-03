"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/actionTypes');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash');  //wtf is this?
var CHANGE_EVENT = 'change';

//members
var _authors = [];

//empty new object, extend it using events.prototype then define the rest of
//the class -- base class
var AuthorStore = assign({}, EventEmitter.prototype, {
  //core function
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  //core function
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  //core function
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /*Authors interface*/
  getAllAuthors: function() {
    return _authors;
  },

  getAuthorById: function(id) {
    return _.find(_authors, {id: id});
  }

});

/*private methods of the class*/

//event handler .....
Dispatcher.register(function(action) {
  switch (action.actionType) {
    case ActionTypes.CREATE_AUTHOR:
        _authors.push(action.author);
        AuthorStore.emitChange();
      break;
    case ActionTypes.INITIALIZE:
      _authors = action.initialData.authors;
      AuthorStore.emitChange();
      break;
     case ActionTypes.UPDATE_AUTHOR:
      var existingAuthor = _.find(_authors, {id: action.author.id});
      var existingAuthorIndex = _.indexOf(_authors, existingAuthor);
      _authors.splice(existingAuthorIndex, 1, action.author);
      AuthorStore.emitChange();
      break;
    case ActionTypes.DELETE_AUTHOR:
      _.remove(_authors, function(author){
        return action.id === author.id;
      });
      AuthorStore.emitChange();
      break;
    default:
      //this space intentionally left blank
  }
});

module.exports = AuthorStore;
