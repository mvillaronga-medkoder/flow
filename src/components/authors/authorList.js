"use strict";

var React = require('react');
var Route = require('react-router');
var Link = require('react-router').Link;

var AuthorList = React.createClass({
  propTypes: {
    authors: React.PropTypes.array.isRequired
  },


  render: function() {
    //iternates over authors
    var createAuthorRow = function(author) {
        return (
          <tr key={author.id}>
          <td><Link to="manageAuthor" params={{id: author.id}}>{author.id}</Link></td>
          <td>{author.lastName}, {author.firstName}</td>
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
