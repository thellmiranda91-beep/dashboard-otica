import { useState } from 'react';
import { C, ft, ftD } from '../config/theme.js';
import { Card, Badge, Btn, Inp } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function UsersPage() {
  const { users, addUser, toggleUser, removeUser } = useAuth();
  const [showNew, setShowNew] = useState(false);
  const [newUser, setNewUser] = useState({ username:'', password:'', name:'', role:'editor', email:'' });

  const save = () => {
    if (!newUser.username || !newUser.password) return;
    addUser(newUser);
    setNewUser({ username:'', password:'', name:'', role:'editor', email:'' });
    setShowNew(false);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:ftD,fontSize:24,fontWeight:700,color:C.nv,margin:"0 0 4px"}}>Usuários</h1>
          <p style={{fontFamily:ft,fontSize:14,color:C.md,margin:0}}>{users.length} cadastrados</p>
        </div>
        <Btn primary onClick={() => setShowNew(true)}>+ Novo usuário</Btn>
      </div>

      {showNew && (
        <Card style={{marginBottom:20,border:`2px solid ${C.co}30`}}>
          <h3 style={{fontFamily:ftD,fontSize:17,fontWeight:700,color:C.nv,margin:"0 0 16px"}}>Criar usuário</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Inp label="Nome completo" value={newUser.name} onChange={e => setNewUser(p => ({...p, name: e.target.value}))} placeholder="João Silva"/>
            <Inp label="Email" value={newUser.email} onChange={e => setNewUser(p => ({...p, email: e.target.value}))} placeholder="joao@elior.com.br"/>
            <Inp label="Usuário (login)" value={newUser.username} onChange={e => setNewUser(p => ({...p, username: e.target.value}))} placeholder="joao.silva"/>
            <Inp label="Senha" type="password" value={newUser.password} onChange={e => setNewUser(p => ({...p, password: e.target.value}))}/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontFamily:ft,fontSize:12,fontWeight:600,color:C.md,display:"block",marginBottom:5}}>Perfil</label>
            <select value={newUser.role} onChange={e => setNewUser(p => ({...p, role: e.target.value}))} style={{fontFamily:ft,width:"100%",padding:"11px 14px",border:`1.5px solid ${C.bd}`,borderRadius:10,fontSize:14,background:C.wh,color:C.tx}}>
              <option value="admin">Administrador (acesso total)</option>
              <option value="editor">Editor (produtos e conteúdo)</option>
              <option value="marketing">Marketing (funis e mensagens)</option>
              <option value="viewer">Visualizador (apenas leitura)</option>
            </select>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn primary onClick={save} disabled={!newUser.username || !newUser.password}>Criar</Btn>
            <Btn onClick={() => setShowNew(false)}>Cancelar</Btn>
          </div>
        </Card>
      )}

      <Card style={{padding:0}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontFamily:ft}}>
          <thead>
            <tr style={{borderBottom:`2px solid ${C.bd}`}}>
              {["Usuário","Nome","Email","Perfil","Status","Último login",""].map(h => (
                <th key={h} style={{textAlign:"left",padding:"12px 14px",fontSize:11,fontWeight:600,color:C.md,textTransform:"uppercase"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{borderBottom:`1px solid ${C.bd}`}}>
                <td style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:32,height:32,borderRadius:8,background:C.nvL,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:ft,fontSize:13,fontWeight:700,color:"#7DD3C0"}}>{u.name?.[0] || "?"}</div>
                    <span style={{fontSize:13,fontWeight:600,color:C.nv}}>{u.username}</span>
                  </div>
                </td>
                <td style={{padding:"12px 14px",fontSize:13,color:C.nv}}>{u.name}</td>
                <td style={{padding:"12px 14px",fontSize:13,color:C.md}}>{u.email}</td>
                <td style={{padding:"12px 14px"}}><Badge color={u.role==='admin'?C.co:u.role==='editor'?C.ig:u.role==='marketing'?C.sg:C.lt}>{u.role}</Badge></td>
                <td style={{padding:"12px 14px"}}><Badge color={u.active?C.sg:C.dn}>{u.active?"Ativo":"Inativo"}</Badge></td>
                <td style={{padding:"12px 14px",fontSize:12,color:C.lt}}>{u.lastLogin}</td>
                <td style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={() => toggleUser(u.id)} style={{background:u.active?C.dnS:C.sgS,border:"none",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontFamily:ft,fontSize:11,fontWeight:600,color:u.active?C.dn:C.sg}}>
                      {u.active ? "Desativar" : "Ativar"}
                    </button>
                    {u.username !== 'teomiranda' && (
                      <button onClick={() => removeUser(u.id)} style={{background:C.dnS,border:"none",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontFamily:ft,fontSize:11,fontWeight:600,color:C.dn}}>
                        Excluir
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
