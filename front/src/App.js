import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { Route } from 'react-router-dom';
import CategoryList from './components/Category/CategoryList';

function App() {
  return (
    <div>
      <Route component={Login} path='/auth' exact />
      <Route component={Register} path='/auth/register' />
      <Route component={CategoryList} path='/' exact />
    </div>
  );
}

export default App;
