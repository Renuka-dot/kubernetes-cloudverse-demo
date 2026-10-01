import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const location = useLocation();
  const navItems = [
    { path: '/dashboard', label: '🏠 Dashboard' },
    { path: '/products',  label: '🛍️ Products'  },
    { path: '/cart',      label: '🛒 Cart'       },
  ];

  return (
    <nav style={{
      position:'sticky',top:0,zIndex:100,
      background:'rgba(10,10,15,0.85)',backdropFilter:'blur(30px)',
      borderBottom:'1px solid rgba(255,255,255,0.08)',
      padding:'0 40px',display:'flex',alignItems:'center',
      justifyContent:'space-between',height:'70px'
    }}>
      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
        <div style={{width:36,height:36,borderRadius:'10px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',boxShadow:'0 4px 15px rgba(99,102,241,0.4)'}}>☁️</div>
        <span style={{fontSize:'20px',fontWeight:800}} className="gradient-text">CloudVerse</span>
      </div>
      <div style={{display:'flex',gap:'8px'}}>
        {navItems.map(item => (
          <Link key={item.path} to={item.path} style={{
            textDecoration:'none',padding:'8px 20px',borderRadius:'10px',fontSize:'14px',fontWeight:500,
            color: location.pathname===item.path?'white':'rgba(255,255,255,0.6)',
            background: location.pathname===item.path?'rgba(99,102,241,0.25)':'transparent',
            border: location.pathname===item.path?'1px solid rgba(99,102,241,0.4)':'1px solid transparent',
            transition:'all 0.2s ease'
          }}>{item.label}</Link>
        ))}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'8px 16px'}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:700}}>
            {user?.username?.[0]?.toUpperCase()||'U'}
          </div>
          <span style={{fontSize:'14px',fontWeight:500}}>{user?.username}</span>
        </div>
        <button onClick={onLogout} style={{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',color:'#ef4444',padding:'8px 18px',borderRadius:'10px',fontSize:'14px',fontWeight:600,cursor:'pointer'}}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
