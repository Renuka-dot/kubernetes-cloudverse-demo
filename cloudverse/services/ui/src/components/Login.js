import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [form, setForm]     = useState({ username:'', password:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/login', form);
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'radial-gradient(ellipse at top left,rgba(99,102,241,0.15) 0%,transparent 50%),#0a0a0f'}}>
      <div style={{position:'fixed',top:'10%',left:'5%',width:'400px',height:'400px',background:'rgba(99,102,241,0.08)',borderRadius:'50%',filter:'blur(80px)',animation:'float 6s ease-in-out infinite',pointerEvents:'none'}}/>
      <div style={{width:'100%',maxWidth:'440px',position:'relative'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <div style={{width:72,height:72,borderRadius:'20px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',margin:'0 auto 20px',boxShadow:'0 8px 32px rgba(99,102,241,0.4)',animation:'pulse-glow 3s ease-in-out infinite'}}>☁️</div>
          <h1 style={{fontSize:'32px',fontWeight:800,marginBottom:'8px'}} className="gradient-text">CloudVerse</h1>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'15px'}}>Sign in to your account</p>
        </div>
        <div className="glass" style={{padding:'40px'}}>
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:'20px'}}>
              <label style={{display:'block',marginBottom:'8px',fontSize:'14px',fontWeight:500,color:'rgba(255,255,255,0.7)'}}>Username</label>
              <input type="text" placeholder="Enter your username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required />
            </div>
            <div style={{marginBottom:'28px'}}>
              <label style={{display:'block',marginBottom:'8px',fontSize:'14px',fontWeight:500,color:'rgba(255,255,255,0.7)'}}>Password</label>
              <input type="password" placeholder="Enter your password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
            </div>
            {error && <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'10px',padding:'12px 16px',marginBottom:'20px',color:'#f87171',fontSize:'14px'}}>⚠️ {error}</div>}
            <button type="submit" className="btn-primary" style={{width:'100%'}} disabled={loading}>
              {loading ? '⏳ Signing in...' : '🚀 Sign In'}
            </button>
          </form>
          <p style={{textAlign:'center',marginTop:'24px',color:'rgba(255,255,255,0.5)',fontSize:'14px'}}>
            Don't have an account?{' '}
            <Link to="/register" style={{color:'#6366f1',fontWeight:600,textDecoration:'none'}}>Create one</Link>
          </p>
        </div>
        <div style={{marginTop:'16px',padding:'14px 20px',background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'12px',textAlign:'center'}}>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.5)'}}>Demo: <span style={{color:'#a5b4fc'}}>admin</span> / <span style={{color:'#a5b4fc'}}>admin123</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
