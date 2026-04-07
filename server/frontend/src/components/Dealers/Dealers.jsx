import React, { useState, useEffect } from 'react';

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [state, setState] = useState('All');
  const [states, setStates] = useState([]);

  const fetchDealers = async (filterState = 'All') => {
    const url = filterState === 'All'
      ? '/djangoapp/get_dealers'
      : `/djangoapp/get_dealers/${filterState}`;
    const res = await fetch(url);
    const data = await res.json();
    setDealers(data.dealers || []);
  };

  useEffect(() => {
    fetchDealers();
    fetch('/djangoapp/get_dealers')
      .then(r => r.json())
      .then(data => {
        const unique = [...new Set((data.dealers || []).map(d => d.st))];
        setStates(unique);
      });
  }, []);

  const handleFilter = (e) => {
    const val = e.target.value;
    setState(val);
    fetchDealers(val);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ color: '#333' }}>Car Dealerships</h1>
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>Filter by State:</label>
        <select value={state} onChange={handleFilter} style={{ padding: '6px 12px', fontSize: 14 }}>
          <option value="All">All States</option>
          {states.map(st => <option key={st} value={st}>{st}</option>)}
        </select>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#2c3e50', color: '#fff' }}>
            <th style={{ padding: 12, textAlign: 'left' }}>Dealer Name</th>
            <th style={{ padding: 12, textAlign: 'left' }}>City</th>
            <th style={{ padding: 12, textAlign: 'left' }}>State</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Address</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Reviews</th>
          </tr>
        </thead>
        <tbody>
          {dealers.map((d, i) => (
            <tr key={d.id} style={{ background: i % 2 === 0 ? '#f9f9f9' : '#fff', borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: 12 }}><a href={`/dealer/${d.id}`} style={{ color: '#2980b9', textDecoration: 'none', fontWeight: 600 }}>{d.full_name}</a></td>
              <td style={{ padding: 12 }}>{d.city}</td>
              <td style={{ padding: 12 }}>{d.st}</td>
              <td style={{ padding: 12 }}>{d.address}</td>
              <td style={{ padding: 12 }}><a href={`/dealer/${d.id}`} style={{ color: '#27ae60' }}>View Reviews</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;
