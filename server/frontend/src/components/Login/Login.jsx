import React, { useState } from 'react';

const LoginPanel = () => {
  const [form, setForm] = useState({ userName: '', password: '' });
  const [error, setError] = useState('');

  const getCookie = (name) => {
    const val = `; ${document.cookie}`.split(`; ${name}=`);
    if (val.length === 2) return val.pop().split(';').shift();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/djangoapp/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.status === 'Authenticated') {
      sessionStorage.setItem('username', data.userName);
      window.location.href = '/dealers';
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 400, margin: '80px auto', padding: 40, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2 style={{ marginBottom: 24 }}>Login</h2>
      {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input placeholder="Username" value={form.userName} onChange={e => setForm({ ...form, userName: e.target.value })}
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} required />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} required />
        <button type="submit" style={{ background: '#2c3e50', color: '#fff', padding: '12px', border: 'none', borderRadius: 6, fontSize: 16, cursor: 'pointer' }}>Login</button>
      </form>
      <p style={{ marginTop: 16, textAlign: 'center' }}>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
};

export default LoginPanel;
