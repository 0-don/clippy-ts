import { HashRouter, Switch, Route } from 'react-router-dom';
import About from './pages/About';
import App from './pages/App';
import Settings from './pages/Settings';

const Routes = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/about" component={About} />
        <Route exact path="/" component={App} />
      </Switch>
    </HashRouter>
  );
};

export default Routes;
