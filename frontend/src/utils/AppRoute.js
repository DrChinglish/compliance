import React from 'react';
import { Route } from 'react-router-dom';

const AppRoute = ({
  element: Element,
  layout: Layout,
  ...rest
}) => {
  //console.log(Component)
  Layout = (Layout === undefined) ? props => (<>{props.children}</>) : Layout;
  
  return (
    <Route
      {...rest}
      element={
        <Layout>
          <Element />
        </Layout>
      } />
  );
}

export default AppRoute;