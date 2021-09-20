import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import { Route } from 'react-router-dom';
import CategoryList from './components/Category/CategoryList';
import CategoryAdd from './components/Category/CatrgoryAdd';
import PostList from './components/Post/PostList';
import PostCreate from './components/Post/PostCreate';
import Post from './components/Post/Post';
import ForgotPassword from './components/Auth/ForgotPassword';

function App() {
  return (
    <div>
      <Route component={Login} path='/auth' exact />
      <Route component={Register} path='/auth/register' />
      <Route component={ForgotPassword} path='/auth/forgot-password' />

      <Route component={CategoryList} path='/' exact />
      <Route component={CategoryAdd} path='/category/add' />
      <Route component={PostList} path='/categories/:id' />
      <Route component={PostCreate} path='/:id/post/add' />
      <Route component={Post} path='/post/:id' />
      <Route component={Profile} path='/profile' />
    </div>
  );
}

export default App;
