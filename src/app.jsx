import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Profile } from './profile/profile';
import { Post } from './post/post';
import { Home } from './home/home';
import {View} from './view/view';

export default function App() {
  return (
    <BrowserRouter>
        <nav className="navbar fixed-top navbar-dark">
            <div className="navbar-brand">
                Game Shelf<sup>&reg;</sup>
            </div>
            <menu className="navbar-nav">
                <li className="nav-item">
                    <NavLink className="nav-link" to="">
                        Home
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="login">
                        Login
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="post">
                        Post
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="view">
                        View
                    </NavLink>
                </li>
            </menu>
        </nav>
        <Routes>
            <Route path='/' element={<Home />} exact />
            <Route path='/login' element={<Login />} />
            <Route path='/post' element={<Post />} />
            <Route path='/view' element={<View />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    </BrowserRouter>
  );
}