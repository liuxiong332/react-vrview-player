import React from 'react';
import { Grid, Row, Col, Navbar, Nav, NavItem } from 'react-bootstrap';

export default class HeaderNavbar extends React.Component {
  render() {
    let headerInfos = [
      { title: 'Hello World', href: '#' },
      { title: 'Whats APP', href: '#' },
    ];
    let children = headerInfos.map((info) => (
      <NavItem key={info.href} href={info.href}>
        {info.title}
      </NavItem>
    ));
    return (
      <div>
        <Navbar className="header-navbar" fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#" />
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              {children}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
