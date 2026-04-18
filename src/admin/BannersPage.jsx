import { useState } from 'react';
import { C, ft, ftD } from '../config/theme.js';
import { Card, Btn, Inp } from '../components/ui.jsx';

export function BannersPage({ banners, setBanners }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newB, setNewB] = useState({ title: '', desc: '', img: '', link: '', cat: 'home' });

  const add = () => {
    if (!newB.img) return;
    setBanners(prev => [...prev, { ...newB, id: Date.now() }]);
    setNewB({ title: '', desc: '', img: '', link: '', cat: 'home' });
    setShowAdd(false);
  };

  const remove = (id) => setBanners(prev => prev.filter(b => b.id !== id));

  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: ftD, fontSize: 24, fontWeight: 700, color: C.nv, margin: 0 }}>Gestão de Banners</h1>
          <p style={{ color: C.md, fontSize: 14 }}>Controle os destaques da sua página inicial</p>
        </div>
        <Btn primary onClick={() => setShowAdd(true)}>+ Novo Banner</Btn>
      </div>

      {showAdd && (
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: ftD, fontSize: 17, marginBottom: 16 }}>Novo Banner</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Inp label="Título" value={newB.title} onChange={e => setNewB({ ...newB, title: e.target.value })} />
            <Inp label="Link (Destino)" value={newB.link} onChange={e => setNewB({ ...newB, link: e.target.value })} placeholder="/catalog ou URL externa" />
          </div>
          <Inp label="Subtítulo / Descrição" value={newB.desc} onChange={e => setNewB({ ...newB, desc: e.target.value })} />
          <Inp label="Imagem URL (Nano Banner)" value={newB.img} onChange={e => setNewB({ ...newB, img: e.target.value })} placeholder="Cole o link da imagem gerada" />
          
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <Btn primary onClick={add}>Salvar Banner</Btn>
            <Btn onClick={() => setShowAdd(false)}>Cancelar</Btn>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {banners.map(b => (
          <Card key={b.id} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
              <img src={b.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                <button onClick={() => remove(b.id)} style={{ background: C.dn, color: '#FFF', border: 'none', width: 24, height: 24, borderRadius: 6, cursor: 'pointer' }}>&times;</button>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>{b.title || 'Sem título'}</h4>
              <p style={{ margin: 0, fontSize: 12, color: C.md }}>{b.desc || 'Sem descrição'}</p>
              <div style={{ marginTop: 12, fontSize: 11, color: C.lt }}>Link: {b.link}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
