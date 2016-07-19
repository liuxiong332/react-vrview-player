import React from 'react'
import { Route } from 'react-router'
import Home from './components/Home';

export default function() {
  return (
    <Route path="/" component={Home}/>
  );
}
