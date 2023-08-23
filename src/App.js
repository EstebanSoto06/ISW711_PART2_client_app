import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
import SignIn from './login/signIn';
import SignUp from './login/signUp';
import MainPage from './pages/mainPage';
import PromptsPage from './pages/prompts';
import TagsPage from './pages/tags';
import UsersPage from './pages/users';
import Verification from './pages/verificationPage';
import TwoFApage from './pages/2FAPage';
import UserInfo from './pages/userInfo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path='/2fapage' element={<TwoFApage/>} />
        <Route path="/verification" element={<Verification/>} />
        <Route path="/signUp" element={<SignUp/>} /> 
        <Route path="/mainPage" element={<MainPage/>} /> 
        <Route path="/promptsPage" element={<PromptsPage/>} /> 
        <Route path="/tagsPage" element={<TagsPage/>} /> 
        <Route path="/usersPage" element={<UsersPage/>} />
        <Route path='/userInfo' element={<UserInfo/>} /> 
      </Routes>
    </Router>
  );
};

export default App;
