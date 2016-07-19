import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

export default class Footer extends React.Component {
  render() {
    return (
      <footer>
        <Grid fluid={true}>
          <Row>
            <Col md={12}>
              <hr />
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <p>Copyright © 2016 Microsoft.com</p>
            </Col>
            <Col lg={4}>
              <p><a href="#top">Xiong LIU</a></p>
            </Col>
          </Row>
        </Grid>
      </footer>
    );
  }
}
