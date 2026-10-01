import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Register({ onLogin }) {
  const [form, setForm]     = useState({ username:'', email:'', password:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/register', form);
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'radial-gradient(ellipse at top right,rgba(139,92,246,0.15) 0%,transparent 50%),#0a0a0f'}}>
      <div style={{width:'100%',maxWidth:'440px'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <div style={{width:72,height:72,borderRadius:'20px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',margin:'0 auto 20px',boxShadow:'0 8px 32px rgba(99,102,241,0.4)'}}>☁️</div>
          <h1 style={{fontSize:'32px',fontWeight:800,marginBottom:'8px'}} className="gradient-text">Join CloudVerse</h1>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'15px'}}>Create your account</p>
        </div>
        <div className="glass" style={{padding:'40px'}}>
          <form onSubmit={handleSubmit}>
            {['username','email','password'].map(field=>(
              <div key={field} style={{marginBottom:'20px'}}>
                <label style={{display:'block',marginBottom:'8px',fontSize:'14px',fontWeight:500,color:'rgba(255,255,255,0.7)'}}>
                  {field.charAt(0).toUpperCase()+field.slice(1)}
                </label>
                <input
                  type={field==='password'?'password':field==='email'?'email':'text'}
                  placeholder={`Enter your ${field}`}
                  value={form[field]}
                  onChange={e=>setForm({...form,[field]:e.target.value})}
                  required
                />
              </div>
            ))}
            {error && <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'10px',padding:'12px 16px',marginBottom:'20px',color:'#f87171',fontSize:'14px'}}>⚠️ {error}</div>}
            <button type="submit" className="btn-primary" style={{width:'100%',marginTop:'8px'}} disabled={loading}>
              {loading?'⏳ Creating...':'🎉 Create Account'}
            </button>
          </form>
          <p style={{textAlign:'center',marginTop:'24px',color:'rgba(255,255,255,0.5)',fontSize:'14px'}}>
            Already have an account?{' '}
            <Link to="/login" style={{color:'#6366f1',fontWeight:600,textDecoration:'none'}}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
