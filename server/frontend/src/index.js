import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dealers from './components/Dealers/Dealers';
import Dealer from './components/Dealer/Dealer';
import PostReview from './components/PostReview/PostReview';
import LoginPanel from './components/Login/Login';
import Register from './components/Register/Register';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/dealers" element={<Dealers />} />
      <Route path="/dealer/:id" element={<Dealer />} />
      <Route path="/postreview/:id" element={<PostReview />} />
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </BrowserRouter>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
