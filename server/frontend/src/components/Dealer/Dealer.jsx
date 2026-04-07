import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Dealer = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const user = sessionStorage.getItem('username');

  useEffect(() => {
    fetch(`/djangoapp/get_dealers`)
      .then(r => r.json())
      .then(data => {
        const found = (data.dealers || []).find(d => d.id === parseInt(id));
        setDealer(found);
      });
    fetch(`/djangoapp/reviews/dealer/${id}`)
      .then(r => r.json())
      .then(data => setReviews(data.reviews || []));
  }, [id]);

  const sentimentIcon = (s) => s === 'positive' ? '😊' : s === 'negative' ? '😞' : '😐';

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <a href="/dealers" style={{ color: '#2980b9', textDecoration: 'none' }}>← Back to Dealers</a>
      {dealer && (
        <div style={{ margin: '20px 0', padding: 20, background: '#2c3e50', color: '#fff', borderRadius: 8 }}>
          <h1>{dealer.full_name}</h1>
          <p>{dealer.address}, {dealer.city}, {dealer.st} {dealer.zip}</p>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
        <h2>Customer Reviews</h2>
        {user
          ? <a href={`/postreview/${id}`} style={{ background: '#27ae60', color: '#fff', padding: '10px 20px', borderRadius: 6, textDecoration: 'none' }}>Write a Review</a>
          : <a href="/login" style={{ background: '#e67e22', color: '#fff', padding: '10px 20px', borderRadius: 6, textDecoration: 'none' }}>Login to Review</a>
        }
      </div>
      {reviews.length === 0 ? (
        <p style={{ color: '#888' }}>No reviews yet. Be the first!</p>
      ) : (
        reviews.map(r => (
          <div key={r.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 20, marginBottom: 16, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong>{r.name}</strong>
              <span style={{ fontSize: 20 }}>{sentimentIcon(r.sentiment)}</span>
            </div>
            <p style={{ margin: '8px 0', color: '#333' }}>{r.review}</p>
            <small style={{ color: '#888' }}>{r.car_year} {r.car_make} {r.car_model} • {r.purchase_date}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default Dealer;
