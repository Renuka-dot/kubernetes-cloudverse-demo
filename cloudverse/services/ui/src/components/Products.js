import React, { useState } from 'react';
import axios from 'axios';

const products = [
  {id:1, name:'Kubernetes Mastery Course',    price:99,  category:'Education',    icon:'☸️', rating:4.9, reviews:1240},
  {id:2, name:'Docker Deep Dive',             price:79,  category:'Education',    icon:'🐳', rating:4.8, reviews:987},
  {id:3, name:'AWS Solutions Architect',      price:149, category:'Certification',icon:'☁️', rating:4.9, reviews:2100},
  {id:4, name:'Terraform Bootcamp',           price:89,  category:'DevOps',       icon:'🏗️', rating:4.7, reviews:654},
  {id:5, name:'CI/CD Pipeline Setup',         price:59,  category:'DevOps',       icon:'🔄', rating:4.6, reviews:432},
  {id:6, name:'Microservices Design',         price:119, category:'Architecture', icon:'🔗', rating:4.8, reviews:876},
  {id:7, name:'Prometheus & Grafana',         price:69,  category:'Monitoring',   icon:'📊', rating:4.7, reviews:543},
  {id:8, name:'Helm Charts Guide',            price:49,  category:'Kubernetes',   icon:'⛵', rating:4.5, reviews:321},
];

function Products({ user, token }) {
  const [search, setSearch]         = useState('');
  const [addedItems, setAddedItems] = useState({});

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = async (product) => {
    try {
      await axios.post('/api/cart/add',
        {productId:product.id, name:product.name, price:product.price, quantity:1},
        {headers:{Authorization:`Bearer ${token}`}}
      );
      setAddedItems(prev=>({...prev,[product.id]:true}));
      setTimeout(()=>setAddedItems(prev=>({...prev,[product.id]:false})),2000);
    } catch(err) { console.error('Add to cart error:',err); }
  };

  return (
    <div style={{padding:'40px',maxWidth:'1400px',margin:'0 auto'}}>
      <div style={{marginBottom:'36px'}}>
        <h1 style={{fontSize:'32px',fontWeight:800,marginBottom:'8px'}}>🛍️ <span className="gradient-text">Product Catalog</span></h1>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:'16px',marginBottom:'24px'}}>Explore our DevOps learning resources</p>
        <input type="text" placeholder="🔍 Search products or categories..." value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:'460px'}} />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'24px'}}>
        {filtered.map(product=>(
          <div key={product.id} className="card">
            <div style={{width:'100%',height:'140px',background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))',border:'1px solid rgba(99,102,241,0.15)',borderRadius:'14px',marginBottom:'20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'52px'}}>{product.icon}</div>
            <div style={{marginBottom:'8px'}}>
              <span style={{background:'rgba(99,102,241,0.15)',color:'#a5b4fc',fontSize:'11px',fontWeight:700,padding:'4px 10px',borderRadius:'6px',textTransform:'uppercase',letterSpacing:'0.5px'}}>{product.category}</span>
            </div>
            <h3 style={{fontSize:'17px',fontWeight:700,marginBottom:'8px'}}>{product.name}</h3>
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'16px'}}>
              <span style={{color:'#fbbf24',fontSize:'14px'}}>★ {product.rating}</span>
              <span style={{color:'rgba(255,255,255,0.4)',fontSize:'13px'}}>({product.reviews} reviews)</span>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'auto'}}>
              <span style={{fontSize:'24px',fontWeight:800,color:'#6366f1'}}>${product.price}</span>
              <button onClick={()=>addToCart(product)} style={{
                background: addedItems[product.id]?'linear-gradient(135deg,#10b981,#059669)':'linear-gradient(135deg,#6366f1,#8b5cf6)',
                border:'none',color:'white',padding:'10px 22px',borderRadius:'10px',fontSize:'14px',fontWeight:600,cursor:'pointer',transition:'all 0.3s ease',
                boxShadow: addedItems[product.id]?'0 4px 15px rgba(16,185,129,0.4)':'0 4px 15px rgba(99,102,241,0.4)'
              }}>
                {addedItems[product.id]?'✓ Added!':'+ Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
