import React, { useRef, useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
import ReactGA from 'react-ga';

// Layouts
import LayoutDefault from './layouts/LayoutDefault';

// Views 
import Detail from './views/Detail';
import Home from './views/Home';

import LayoutDetail from './layouts/LayoutDetail';
import  './assets/scss/style.scss';
import ProjectList from './views/ProjectList';
import CreateProject from './views/CreateProject';
import Checklist from './views/Checklist'
import CustomChecklist from './views/CustomChecklist'

// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_CODE);

const trackPage = page => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

const App = () => {

  const childRef = useRef();
  let location = useLocation();

  useEffect(() => {
    const page = location.pathname;
    document.body.classList.add('is-loaded')
    childRef.current.init();
    trackPage(page);
   
  }, [location]);

  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <Routes>
          <Route path="/home" element={<LayoutDefault/>}>
            <Route index element={<Home/>}/>
          </Route>
          <Route path="/customchecklist" element={<LayoutDetail/>}>
            <Route index element={<CustomChecklist/>}/>
          </Route>
          <Route path="/checklist" element={<LayoutDetail/>}>
            <Route index element={<Checklist/>}/>
            {/* <Route path='result' element={<ChecklistResult/>}/> */}
            <Route path=":id" element={<Checklist/>}/>
          </Route>
          <Route path="/detail" element={<LayoutDetail/>} >
            <Route path=':id' element={<Detail/>}/>
          </Route>
          <Route path="/list" element={<LayoutDetail/>} >
            <Route path=':type' element={<ProjectList/>}/>
          </Route>
          <Route path="/new" element={<LayoutDetail/>} >
            <Route index element={<CreateProject/>}/>
          </Route>
          {/* <AppRoute exact path="/" element={Home} layout={LayoutDefault} />
          <AppRoute exact path="/detail" element={Detail} layout={LayoutDetail} /> */}
        </Routes>
      )} />
  );
}

export default App;