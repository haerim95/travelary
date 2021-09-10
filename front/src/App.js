import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { Route } from 'react-router-dom';
import CategoryList from './components/Category/CategoryList';
import CategoryAdd from './components/Category/CatrgoryAdd';
import PostList from './components/Post/PostList';
import PostCreate from './components/Post/PostCreate';
import Post from './components/Post/Post';

function App() {
  return (
    <div>
      <Route component={Login} path='/auth' exact />
      <Route component={Register} path='/auth/register' />
      <Route component={CategoryList} path='/' exact />
      <Route component={CategoryAdd} path='/category/add' />
      <Route component={PostList} path='/categories/:id' />
      <Route component={PostCreate} path='/:id/post/add' />
      <Route component={Post} path='/post/:id' />
    </div>
  );
}

export default App;
