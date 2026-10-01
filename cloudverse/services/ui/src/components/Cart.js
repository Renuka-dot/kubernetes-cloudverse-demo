import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart({ user, token }) {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart', {headers:{Authorization:`Bearer ${token}`}});
      setItems(res.data.items||[]);
    } catch(err) { setItems([]); }
    finally { setLoading(false); }
  };

  const placeOrder = async () => {
    try {
      await axios.post('/api/orders',{items,userId:user.id},{headers:{Authorization:`Bearer ${token}`}});
      setOrderPlaced(true); setItems([]);
    } catch(err) { console.error('Order error:',err); }
  };

  const total = items.reduce((sum,item)=>sum+(item.price*item.quantity),0);

  return (
    <div style={{padding:'40px',maxWidth:'900px',margin:'0 auto'}}>
      <h1 style={{fontSize:'32px',fontWeight:800,marginBottom:'8px'}}>🛒 <span className="gradient-text">Your Cart</span></h1>
      <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'32px'}}>{items.length} item{items.length!==1?'s':''} in your cart</p>

      {orderPlaced&&(
        <div style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'16px',padding:'24px',marginBottom:'24px',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'12px'}}>🎉</div>
          <h3 style={{color:'#4ade80',fontSize:'20px',fontWeight:700}}>Order Placed Successfully!</h3>
          <p style={{color:'rgba(255,255,255,0.5)',marginTop:'8px'}}>Your order was sent to Order Service → Notification Service via pod-to-pod communication!</p>
        </div>
      )}

      {loading?(
        <div style={{textAlign:'center',padding:'60px',color:'rgba(255,255,255,0.4)'}}>Loading cart...</div>
      ):items.length===0&&!orderPlaced?(
        <div style={{textAlign:'center',padding:'80px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'20px'}}>
          <div style={{fontSize:'64px',marginBottom:'16px'}}>🛒</div>
          <h3 style={{fontSize:'20px',fontWeight:600,marginBottom:'8px'}}>Cart is empty</h3>
          <p style={{color:'rgba(255,255,255,0.4)'}}>Add products from the catalog</p>
        </div>
      ):(
        <>
          <div style={{display:'flex',flexDirection:'column',gap:'16px',marginBottom:'32px'}}>
            {items.map((item,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <h4 style={{fontWeight:600,fontSize:'16px',marginBottom:'4px'}}>{item.name}</h4>
                  <p style={{color:'rgba(255,255,255,0.4)',fontSize:'13px'}}>Qty: {item.quantity}</p>
                </div>
                <span style={{fontSize:'20px',fontWeight:700,color:'#6366f1'}}>${item.price*item.quantity}</span>
              </div>
            ))}
          </div>
          <div style={{background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'20px',padding:'28px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'24px'}}>
              <span style={{fontSize:'18px',fontWeight:600}}>Total</span>
              <span style={{fontSize:'28px',fontWeight:800}} className="gradient-text">${total}</span>
            </div>
            <button onClick={placeOrder} className="btn-primary" style={{width:'100%',padding:'16px',fontSize:'16px'}}>🚀 Place Order</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
