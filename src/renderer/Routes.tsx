import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import About from './pages/About';
import App from './pages/App';
import Settings from './pages/Settings';

const Routes = () => {
  return (
    <Router hashType="hashbang">
      <Switch>
        <Route path="/settings" component={Settings} />
        <Route path="/about" component={About} />
        <Route path="/" exact component={App} />
      </Switch>
    </Router>
  );
};

export default Routes;
