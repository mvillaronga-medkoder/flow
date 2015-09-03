"use strict";

var React = require('react');
var Route = require('react-router');
var Link = require('react-router').Link;
var AuthorActions = require('../../actions/authorActions.js');
var toastr = require('toastr');

var AuthorList = React.createClass({
  propTypes: {
    authors: React.PropTypes.array.isRequired
  },

  //can be passed down from the parent/controller
  deleteAuthor: function(id, event) {
    event.preventDefault();
    AuthorActions.deleteAuthor(id);
    toastr.success('Author Deleted');
  },

  render: function() {
    //iternates over authors
    var createAuthorRow = function(author) {
        return (
          <tr key={author.id}>
          <td><Link to="manageAuthor" params={{id: author.id}}>{author.id}</Link></td>
          <td>{author.lastName}, {author.firstName}</td>
          <td><a href="#" onClick={this.deleteAuthor.bind(this, author.id)}>Delete</a></td>
          </tr>
        );
    };

    return (
      <div>
        <table className="table">
          <thead>
            <th>ID</th>
            <th>Name</th>
          </thead>
          <tbody>
            {this.props.authors.map(createAuthorRow, this)}
          </tbody>
        </table>
      </div>
    );
  }

});

module.exports = AuthorList;
