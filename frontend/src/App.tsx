import React, { useEffect } from 'react';
import { createStyles,makeStyles,Theme,ThemeProvider } from '@material-ui/core';
import './App.scss';
import HomePage from "./pages/HomePage";
import CountryPage from "./pages/CountryPage";
import { theme } from './mui-style';
import { BrowserRouter as Router, Route, Switch, } from "react-router-dom";
import Footer from './components/Footer';
import Header from './components/Header';
import { useDispatch } from "react-redux";
import { setUser } from './actions/set-user';
import getUser from './getUser';

// simple api request
import { CloudinaryContext } from 'cloudinary-react';
import cloudName from './constants/cloudName';
import SideBar from './components/SideBar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      'min-height': '100vh',
      display: 'flex',
      'flex-direction': 'column'
    },
    pageWrapper: {
      position: 'relative',
      height: 'calc(100vh - 162px)'
    },
    input: {
      display: 'none',
    },
  }),
);

function App() {
  const classes = useStyles();
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setUser(getUser()));
  }, []);

  return (
    <CloudinaryContext cloudName={cloudName} className={classes.root}>
      <ThemeProvider theme={theme}>
        <Router>
          <Header />
          <div className={classes.pageWrapper}>
            <Switch>

              <Route path="/country/:id">
                <CountryPage />
                <SideBar />
              </Route>

              <Route path="/">
                <HomePage />
              </Route>

            </Switch>

          </div>


          <Footer />
        </Router>
      </ThemeProvider>
    </CloudinaryContext>
  );
}

export default App;
