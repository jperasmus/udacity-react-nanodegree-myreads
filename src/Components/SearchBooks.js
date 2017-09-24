import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Books from './Books';
import { search } from '../BooksAPI';

class SearchBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      searching: false,
      searchFailed: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    const keyword = e.target.value;
    this.setState({
      searching: true,
      searchFailed: false
    });

    search(keyword, 200)
      .then(results => {
        this.setState({ results, searching: false });
      })
      .catch(() => {
        this.setState({ results: [], searching: false, searchFailed: true });
      });
  }

  render() {
    let Results;

    if (this.state.searchFailed) {
      Results = () => <div>Searching failed :(</div>;
    } else if (this.state.searching) {
      Results = () => <div>Finding some books quick...</div>;
    } else {
      Results = () => <Books books={this.state.results} moveBook={this.props.moveBook} />;
    }

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input
              type="text"
              placeholder="Search by title or author"
              onChange={this.handleInputChange}
            />
          </div>
        </div>
        <div className="search-books-results">
          <Results />
        </div>
      </div>
    );
  }
}

export default SearchBooks;
