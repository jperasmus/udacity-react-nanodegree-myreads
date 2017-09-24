import React from 'react';
import { Route } from 'react-router-dom';
import SearchBooks from './Components/SearchBooks';
import ListBooks from './Components/ListBooks';
import './App.css';

class BooksApp extends React.Component {
  render() {
    return (
      <div className="app">
        <Route path="/search" component={SearchBooks} />
        <Route exact path="/" component={ListBooks} />
      </div>
    );
  }
}

export default BooksApp;
