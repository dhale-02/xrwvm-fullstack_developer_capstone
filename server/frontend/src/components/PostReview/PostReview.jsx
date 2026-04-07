import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    review: '', purchase: false, purchase_date: '',
    car_make: '', car_model: '', car_year: new Date().getFullYear()
  });

  useEffect(() => {
    fetch('/djangoapp/get_cars')
      .then(r => r.json())
      .then(data => setCars(data.CarModels || []));
  }, []);

  const getCookie = (name) => {
    const val = `; ${document.cookie}`.split(`; ${name}=`);
    if (val.length === 2) return val.pop().split(';').shift();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, name: sessionStorage.getItem('username') || 'Anonymous', dealership: parseInt(id) };
    const res = await fetch('/djangoapp/add_review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.status === 200) navigate(`/dealer/${id}`);
    else alert('Error: ' + (data.message || 'Could not submit review'));
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      <a href={`/dealer/${id}`} style={{ color: '#2980b9', textDecoration: 'none' }}>← Back to Dealer</a>
      <h1 style={{ margin: '20px 0' }}>Write a Review</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <textarea
          rows={5} required placeholder="Write your review here..."
          value={form.review} onChange={e => setForm({ ...form, review: e.target.value })}
          style={{ padding: 12, fontSize: 15, border: '1px solid #ddd', borderRadius: 6, resize: 'vertical' }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={form.purchase} onChange={e => setForm({ ...form, purchase: e.target.checked })} />
          I purchased a vehicle here
        </label>
        {form.purchase && (
          <input type="date" value={form.purchase_date}
            onChange={e => setForm({ ...form, purchase_date: e.target.value })}
            style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}
          />
        )}
        <select value={form.car_make} onChange={e => setForm({ ...form, car_make: e.target.value })} required
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>
          <option value="">Select Car Make</option>
          {[...new Set(cars.map(c => c.CarMake))].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={form.car_model} onChange={e => setForm({ ...form, car_model: e.target.value })} required
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>
          <option value="">Select Car Model</option>
          {cars.filter(c => c.CarMake === form.car_make).map(c => <option key={c.CarModel} value={c.CarModel}>{c.CarModel}</option>)}
        </select>
        <input type="number" min={2000} max={2026} value={form.car_year}
          onChange={e => setForm({ ...form, car_year: parseInt(e.target.value) })}
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}
        />
        <button type="submit" style={{ background: '#2c3e50', color: '#fff', padding: '12px 24px', border: 'none', borderRadius: 6, fontSize: 16, cursor: 'pointer' }}>
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default PostReview;
