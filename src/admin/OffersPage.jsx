import { useState } from 'react';
import { C, ft, ftD, fm } from '../config/theme.js';
import { Card, Btn, Inp } from '../components/ui.jsx';

export function OffersPage({ lensOptions, setLensOptions, treatments, setTreatments, bumps, setBumps, crossItems, setCrossItems }) {
  const [tab, setTab] = useState('lenses');

  const updateList = (list, setList, id, field, val) => {
    setList(list.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const addItem = (list, setList, type) => {
    const newId = `${type}-${Date.now()}`;
    const newItem = type === 'lens' 
      ? { id: newId, label: 'Nova Lente', price: 0, specs: [], delivery: '' }
      : { id: newId, name: 'Nova Oferta', price: 0 };
    setList([...list, newItem]);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: ftD, fontSize: 24, fontWeight: 800, color: C.nv, margin: 0 }}>Ofertas & Configurações</h1>
          <p style={{ color: C.md, fontSize: 14 }}>Gerencie preços, descrições e upgrades da loja</p>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: 24, borderBottom: `1px solid ${C.bd}`, marginBottom: 32 }}>
        <button onClick={() => setTab('lenses')} style={{ background: 'none', border: 'none', padding: '12px 4px', borderBottom: tab === 'lenses' ? `2px solid ${C.nv}` : '2px solid transparent', color: tab === 'lenses' ? C.nv : C.lt, fontWeight: 700, cursor: 'pointer' }}>Etapa 2: Lentes</button>
        <button onClick={() => setTab('treatments')} style={{ background: 'none', border: 'none', padding: '12px 4px', borderBottom: tab === 'treatments' ? `2px solid ${C.nv}` : '2px solid transparent', color: tab === 'treatments' ? C.nv : C.lt, fontWeight: 700, cursor: 'pointer' }}>Etapa 3: Tratamentos</button>
        <button onClick={() => setTab('bumps')} style={{ background: 'none', border: 'none', padding: '12px 4px', borderBottom: tab === 'bumps' ? `2px solid ${C.nv}` : '2px solid transparent', color: tab === 'bumps' ? C.nv : C.lt, fontWeight: 700, cursor: 'pointer' }}>Checkout Bumps</button>
        <button onClick={() => setTab('cross')} style={{ background: 'none', border: 'none', padding: '12px 4px', borderBottom: tab === 'cross' ? `2px solid ${C.nv}` : '2px solid transparent', color: tab === 'cross' ? C.nv : C.lt, fontWeight: 700, cursor: 'pointer' }}>Cross-sells & Acessórios</button>
      </div>

      {/* LENSES TAB */}
      {tab === 'lenses' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 20 }}>
          {lensOptions.map(opt => (
            <Card key={opt.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Inp label="Nome da Lente" value={opt.label} onChange={e => updateList(lensOptions, setLensOptions, opt.id, 'label', e.target.value)} />
                <Inp label="Preço (R$)" type="number" value={opt.price} onChange={e => updateList(lensOptions, setLensOptions, opt.id, 'price', parseFloat(e.target.value))} />
              </div>
              <Inp label="Prazo de Entrega" value={opt.delivery} onChange={e => updateList(lensOptions, setLensOptions, opt.id, 'delivery', e.target.value)} />
              <Inp label="Imagem (URL)" value={opt.img} onChange={e => updateList(lensOptions, setLensOptions, opt.id, 'img', e.target.value)} />
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.lt, display: 'block', marginBottom: 8 }}>Especificações (uma por linha)</label>
                <textarea 
                  style={{ width: '100%', padding: 12, borderRadius: 8, border: `1px solid ${C.bd}`, fontFamily: ft, fontSize: 13, minHeight: 80 }}
                  value={opt.specs.join('\n')}
                  onChange={e => updateList(lensOptions, setLensOptions, opt.id, 'specs', e.target.value.split('\n'))}
                />
              </div>
            </Card>
          ))}
          <Btn outline onClick={() => addItem(lensOptions, setLensOptions, 'lens')}>+ Adicionar Opção de Lente</Btn>
        </div>
      )}

      {/* TREATMENTS TAB */}
      {tab === 'treatments' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 20 }}>
          {treatments.map(t => (
            <Card key={t.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Inp label="Nome do Tratamento" value={t.label} onChange={e => updateList(treatments, setTreatments, t.id, 'label', e.target.value)} />
                <Inp label="Preço Adicional" type="number" value={t.price} onChange={e => updateList(treatments, setTreatments, t.id, 'price', parseFloat(e.target.value))} />
              </div>
              <Inp label="Descrição Curta" value={t.desc} onChange={e => updateList(treatments, setTreatments, t.id, 'desc', e.target.value)} />
              <div style={{ display: 'flex', gap: 12 }}>
                <Inp label="Badge (ex: Mais Vendido)" value={t.status || ''} onChange={e => updateList(treatments, setTreatments, t.id, 'status', e.target.value)} />
                <Inp label="Prazo" value={t.delivery} onChange={e => updateList(treatments, setTreatments, t.id, 'delivery', e.target.value)} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* BUMPS TAB */}
      {tab === 'bumps' && (
        <div style={{ maxWidth: 600 }}>
          <Card>
            {bumps.map(b => (
              <div key={b.id} style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'end', borderBottom: `1px solid ${C.bd}`, paddingBottom: 16 }}>
                <div style={{ flex: 1 }}><Inp label="Nome" value={b.name} onChange={e => updateList(bumps, setBumps, b.id, 'name', e.target.value)} /></div>
                <div style={{ width: 120 }}><Inp label="Preço" type="number" value={b.price} onChange={e => updateList(bumps, setBumps, b.id, 'price', parseFloat(e.target.value))} /></div>
                <Btn outline style={{ height: 42, color: 'red' }} onClick={() => setBumps(bumps.filter(item => item.id !== b.id))}>&times;</Btn>
              </div>
            ))}
            <Btn primary onClick={() => addItem(bumps, setBumps, 'bump')}>+ Novo Bump de Checkout</Btn>
          </Card>
        </div>
      )}

      {/* CROSS-SELLS TAB */}
      {tab === 'cross' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
          {crossItems.map(c => (
            <Card key={c.id}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Inp label="Produto" value={c.name} onChange={e => updateList(crossItems, setCrossItems, c.id, 'name', e.target.value)} />
                <Inp label="Preço" type="number" value={c.price} onChange={e => updateList(crossItems, setCrossItems, c.id, 'price', parseFloat(e.target.value))} />
              </div>
              <Inp label="Imagem (URL)" value={c.img || ''} onChange={e => updateList(crossItems, setCrossItems, c.id, 'img', e.target.value)} />
              <Btn outline style={{ color: 'red', marginTop: 12 }} onClick={() => setCrossItems(crossItems.filter(item => item.id !== c.id))}>Remover Oferta</Btn>
            </Card>
          ))}
          <Btn primary onClick={() => addItem(crossItems, setCrossItems, 'cross')}>+ Nova Oferta de Acessório</Btn>
        </div>
      )}

      <div style={{ marginTop: 40, borderTop: `1px solid ${C.bd}`, paddingTop: 24, textAlign: 'right' }}>
        <p style={{ color: C.md, fontSize: 13, marginBottom: 12 }}>As alterações são salvas automaticamente no armazenamento local.</p>
        <Btn primary style={{ padding: '14px 40px' }} onClick={() => window.location.reload()}>Publicar Alterações 🚀</Btn>
      </div>
    </div>
  );
}
