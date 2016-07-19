import React from 'react';
import HeaderNavbar from './HeaderNavbar';
import HomeOverview from './HomeOverview';
import Foolter from './Footer';

export default class Home extends React.Component {
  render() {
    return (
      <div className="home-page">
        <HeaderNavbar />
        <section className="main-section">
          <HomeOverview />
        </section>
        <Foolter />
      </div>
    );
  }
}
