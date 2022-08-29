import React from 'react';
import Header from '../components/layout/Header';
import { Outlet } from 'react-router-dom';
import Footer from '../components/layout/Footer';

const LayoutDefault = () => (
  <>
    <Header navPosition="right" className="reveal-from-bottom" />
    <main className="site-content">
      <Outlet/>
    </main>
    <Footer />
  </>
);

export default LayoutDefault;  