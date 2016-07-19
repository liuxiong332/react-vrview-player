import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

export default class HomeOverview extends React.Component {
  render() {
    return (
      <Grid fluid={true} className="home-container">
        <Row className="home-overview">
          <Col lgOffset={3} lg={6} mdOffset={2} md={8} sm={12}>
            <h1>My Framework</h1>
          </Col>
        </Row>
      </Grid>
    );
  }
}
