import { C, ft, ftD } from '../config/theme.js';
import { useAuth } from '../context/AuthContext.jsx';

const NAV = [
  {id:"dashboard",l:"Dashboard"},
  {id:"products",l:"Produtos"},
  {id:"funnels",l:"Funis"},
  {id:"messaging",l:"Mensagens"},
  {id:"finance",l:"Financeiro"},
  {id:"intel",l:"Inteligência"},
  {id:"banners",l:"Banners & IA"},
  {id:"orders",l:"Pedidos"},
  {id:"offers",l:"Ofertas & Lentes"},
  {id:"users",l:"Usuários"},
  {id:"settings",l:"Config"},
];

export function AdminSidebar({ sec, setSec, onStoreClick }) {
  const { user, logout } = useAuth();

  return (
    <aside style={{width:210,background:C.nv,color:C.wh,padding:"20px 0",display:"flex",flexDirection:"column",height:"100vh",position:"fixed",left:0,top:0,zIndex:50}}>
      <div style={{padding:"0 18px",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <span style={{fontFamily:ftD,fontSize:18,fontWeight:700}}>elior</span>
          <span style={{fontFamily:ft,fontSize:9,fontWeight:600,color:"#7DD3C0",marginLeft:6,letterSpacing:1}}>ADMIN</span>
        </div>
        <button onClick={onStoreClick} style={{fontFamily:ft,fontSize:10,fontWeight:600,color:"#7DD3C0",background:"rgba(125,211,192,.15)",border:"none",padding:"4px 8px",borderRadius:6,cursor:"pointer"}}>Loja</button>
      </div>

      <nav style={{flex:1,overflowY:"auto"}}>
        {NAV.map(n => (
          <div key={n.id} onClick={() => setSec(n.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",cursor:"pointer",background:sec===n.id?"rgba(255,255,255,.08)":"transparent",borderRight:sec===n.id?`3px solid ${C.co}`:"3px solid transparent"}}>
            <span style={{fontFamily:ft,fontSize:13,fontWeight:sec===n.id?600:400,color:sec===n.id?C.wh:"rgba(255,255,255,.55)"}}>{n.l}</span>
          </div>
        ))}
      </nav>

      <div style={{padding:"14px 18px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:30,height:30,borderRadius:8,background:C.nvL,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:ft,fontSize:12,fontWeight:700,color:"#7DD3C0"}}>{user?.name?.[0] || "A"}</div>
          <div>
            <p style={{fontFamily:ft,fontSize:12,fontWeight:600,margin:0}}>{user?.name || "Admin"}</p>
            <p style={{fontFamily:ft,fontSize:10,margin:0,color:"rgba(255,255,255,.4)"}}>{user?.role || "admin"}</p>
          </div>
        </div>
        <button onClick={() => { logout(); onStoreClick(); }} style={{fontFamily:ft,fontSize:10,color:"rgba(255,255,255,.4)",background:"none",border:"none",cursor:"pointer",marginTop:8}}>Sair</button>
      </div>
    </aside>
  );
}

export function AdminLayout({ sec, setSec, onStoreClick, children }) {
  return (
    <div style={{fontFamily:ft,color:C.tx,minHeight:"100vh",background:C.wm,display:"flex"}}>
      <AdminSidebar sec={sec} setSec={setSec} onStoreClick={onStoreClick} />
      <main style={{marginLeft:210,flex:1,padding:"24px 28px",minHeight:"100vh"}}>
        {children}
      </main>
    </div>
  );
}
