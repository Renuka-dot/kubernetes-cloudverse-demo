import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatCard = ({ icon, title, value, color, subtitle }) => (
  <div className="card" style={{textAlign:'center',padding:'28px'}}>
    <div style={{width:56,height:56,borderRadius:'16px',background:`${color}20`,border:`1px solid ${color}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',margin:'0 auto 16px'}}>{icon}</div>
    <h3 style={{fontSize:'32px',fontWeight:800,color:color,marginBottom:'4px'}}>{value}</h3>
    <p style={{fontWeight:600,fontSize:'15px',marginBottom:'4px'}}>{title}</p>
    {subtitle&&<p style={{color:'rgba(255,255,255,0.4)',fontSize:'13px'}}>{subtitle}</p>}
  </div>
);

function Dashboard({ user, token }) {
  const serviceHealth = [
    {name:'API Gateway',       status:'healthy',port:4000},
    {name:'Auth Service',      status:'healthy',port:4001},
    {name:'User Service',      status:'healthy',port:4002},
    {name:'Product Service',   status:'healthy',port:4003},
    {name:'Order Service',     status:'healthy',port:4004},
    {name:'Cart Service',      status:'healthy',port:4005},
    {name:'Notification',      status:'healthy',port:4006},
    {name:'Analytics',         status:'healthy',port:4007},
    {name:'Search Service',    status:'healthy',port:4008},
    {name:'PostgreSQL DB',     status:'healthy',port:5432},
  ];

  return (
    <div style={{padding:'40px',maxWidth:'1400px',margin:'0 auto'}}>
      <div style={{marginBottom:'40px',padding:'40px',background:'linear-gradient(135deg,rgba(99,102,241,0.2) 0%,rgba(139,92,246,0.15) 50%,rgba(6,182,212,0.1) 100%)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'24px',position:'relative',overflow:'hidden'}}>
        <h1 style={{fontSize:'36px',fontWeight:800,marginBottom:'8px'}}>
          Welcome back, <span className="gradient-text">{user?.username}</span>! 👋
        </h1>
        <p style={{color:'rgba(255,255,255,0.6)',fontSize:'17px',marginBottom:'24px'}}>
          CloudVerse microservices platform is running at full capacity
        </p>
        <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
          <span style={{background:'rgba(34,197,94,0.15)',border:'1px solid rgba(34,197,94,0.3)',color:'#4ade80',padding:'6px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:600}}>🟢 All 10 Services Online</span>
          <span style={{background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',color:'#a5b4fc',padding:'6px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:600}}>🔵 EKS Cluster Active</span>
          <span style={{background:'rgba(6,182,212,0.15)',border:'1px solid rgba(6,182,212,0.3)',color:'#67e8f9',padding:'6px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:600}}>☁️ AWS ALB Ingress Ready</span>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'20px',marginBottom:'40px'}}>
        <StatCard icon="🛍️" title="Products"      value="48"    color="#6366f1" subtitle="In catalog"       />
        <StatCard icon="📦" title="Orders"        value="12"    color="#8b5cf6" subtitle="This month"       />
        <StatCard icon="🛒" title="Cart Items"    value="3"     color="#06b6d4" subtitle="Ready to checkout" />
        <StatCard icon="🔔" title="Notifications" value="7"     color="#f59e0b" subtitle="Unread"           />
        <StatCard icon="📊" title="Uptime"        value="99.9%" color="#10b981" subtitle="All services"     />
      </div>

      <div style={{marginBottom:'40px'}}>
        <h2 style={{fontSize:'24px',fontWeight:700,marginBottom:'20px'}}>🏗️ Microservices Health</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'16px'}}>
          {serviceHealth.map((svc,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',padding:'18px 22px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <p style={{fontWeight:600,fontSize:'15px',marginBottom:'4px'}}>{svc.name}</p>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:'12px'}}>Port: {svc.port}</p>
              </div>
              <span style={{fontSize:'12px',color:'#4ade80',fontWeight:600}}>● LIVE</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:'32px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'20px'}}>
        <h2 style={{fontSize:'22px',fontWeight:700,marginBottom:'20px'}}>📚 DevOps Concepts in This Project</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'16px'}}>
          {[
            {icon:'🐳',concept:'Docker + ECR',          desc:'Each service containerized & stored in AWS ECR'},
            {icon:'⚖️',concept:'HPA',                   desc:'Auto-scales pods based on CPU metrics'},
            {icon:'🔄',concept:'Rolling Updates',        desc:'Zero-downtime deployments across all services'},
            {icon:'💾',concept:'PV & PVC',               desc:'PostgreSQL data persisted via EBS volume'},
            {icon:'🏷️',concept:'Node Affinity',         desc:'DB pods scheduled on labeled nodes only'},
            {icon:'❤️',concept:'Probes',                 desc:'Liveness & readiness checks on all services'},
            {icon:'🌐',concept:'ALB Ingress',            desc:'Single entry point via AWS Load Balancer'},
            {icon:'🔗',concept:'Pod-to-Pod',             desc:'Services talk via ClusterIP + CoreDNS'},
          ].map((item,i)=>(
            <div key={i} style={{display:'flex',gap:'14px',padding:'16px',background:'rgba(99,102,241,0.05)',border:'1px solid rgba(99,102,241,0.1)',borderRadius:'12px'}}>
              <span style={{fontSize:'24px'}}>{item.icon}</span>
              <div>
                <p style={{fontWeight:600,fontSize:'14px',marginBottom:'4px',color:'#a5b4fc'}}>{item.concept}</p>
                <p style={{fontSize:'13px',color:'rgba(255,255,255,0.5)'}}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
