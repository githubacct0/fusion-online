import React from 'react';
import { Switch, Route, NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap';
import { OpenOrders } from './OpenOrders';
import { ScheduledOrders } from './ScheduledOrders';
import { PastOrders } from './PastOrders';
import { OpenRFQs } from './OpenRFQs';
import { PastRFQs } from './PastRFQs';

import './myaccount.scss';

export interface OrdersProps {

}

export const Orders: React.FC<OrdersProps> = ({

}) => {

  return (
    <>
    <Nav as="ul" className="nav-tabs mb-3">
      <Nav.Item as="li">
        <NavLink
          to="/account/orders/open-orders"
          className="nav-link"
          role="tab"
        >
          Open Orders (3)
        </NavLink>
      </Nav.Item>
      <Nav.Item as="li">
        <NavLink
          to="/account/orders/scheduled-orders"
          className="nav-link"
          role="tab"
        >
          Scheduled Orders (3)
        </NavLink>
      </Nav.Item>
      <Nav.Item as="li">
        <NavLink
          to="/account/orders/past-orders"
          className="nav-link"
          role="tab"
        >
          Past Orders (3)
        </NavLink>
      </Nav.Item>
      <Nav.Item as="li">
        <NavLink
          to="/account/orders/open-rfqs"
          className="nav-link"
          role="tab"
        >
          Open RFQs (3)
        </NavLink>
      </Nav.Item>
      <Nav.Item as="li">
        <NavLink
          to="/account/orders/past-rfqs"
          className="nav-link"
          role="tab"
        >
          Past RFQs (3)
        </NavLink>
      </Nav.Item>
    </Nav>
    <Switch>
      <Route exact path="/account/orders/open-orders" component={OpenOrders} />
      <Route exact path="/account/orders/scheduled-orders" component={ScheduledOrders} />
      <Route exact path="/account/orders/past-orders" component={PastOrders} />
      <Route exact path="/account/orders/open-rfqs" component={OpenRFQs} />
      <Route exact path="/account/orders/past-rfqs" component={PastRFQs} />
    </Switch>
    </>

  );
};
