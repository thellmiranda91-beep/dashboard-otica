import { C, ft, ftD } from '../config/theme.js';
import { ProdCard } from './ProductCard.jsx';

export function CatalogPage({ products, filter, setFilter, searchQ, setSearchQ, openProd }) {
  return (
    <div style={{padding:"48px 24px",maxWidth:1100,margin:"0 auto"}}>
      <h2 style={{fontFamily:ftD,fontSize:28,fontWeight:700,color:C.nv,textAlign:"center",marginBottom:24}}>Coleção Elior</h2>
      <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:28,flexWrap:"wrap"}}>
        {[["all","Todos"],["grau","Grau"],["sol","Sol"]].map(([f,l]) => (
          <button key={f} onClick={() => setFilter(f)} style={{fontFamily:ft,background:filter===f?C.nv:C.wh,color:filter===f?C.wh:C.md,border:`1.5px solid ${filter===f?C.nv:C.bd}`,padding:"8px 20px",fontSize:13,fontWeight:600,cursor:"pointer",borderRadius:10}}>{l}</button>
        ))}
        <input placeholder="Buscar..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{fontFamily:ft,padding:"8px 16px",border:`1.5px solid ${C.bd}`,borderRadius:10,fontSize:13,maxWidth:160,outline:"none",color:C.tx,background:C.wh}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18}}>
        {products.map(p => <ProdCard key={p.id} p={p} onClick={() => openProd(p)}/>)}
      </div>
    </div>
  );
}
