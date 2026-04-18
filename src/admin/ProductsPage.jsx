import { useState, useRef } from 'react';
import { C, ft, ftD, fm, fk, pc } from '../config/theme.js';
import { Card, Badge, Btn, Inp } from '../components/ui.jsx';
import { api } from '../config/api.js';

export function ProductsPage({ products, setProducts }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [seoGenLoading, setSeoGenLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', cat: 'grau', price: '', cost: '', stock: '', 
    desc: '', colors: '', images: [], seoTitle: '', seoDesc: ''
  });

  const fileRef = useRef(null);

  const handleUpload = e => {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      const r = new FileReader();
      r.onload = ev => {
        setForm(prev => ({ ...prev, images: [...prev.images, ev.target.result] }));
      };
      r.readAsDataURL(f);
    });
  };

  const removeImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const genDesc = async () => {
    setAiLoading(true);
    const result = await api.generateDescription(form.name || 'Óculos', form.cat);
    setForm(prev => ({ ...prev, desc: result }));
    setAiLoading(false);
  };

  const genSEO = async () => {
    setSeoGenLoading(true);
    // Simulated AI SEO logic based on product traits
    const title = `${form.name} | Elior Premium Eyewear`;
    const desc = `${form.name} em ${form.cat === 'grau' ? 'acetato premium' : 'lentes polarizadas'}. Design exclusivo Elior com entrega rápida em todo Brasil.`;
    
    setTimeout(() => {
      setForm(prev => ({ ...prev, seoTitle: title, seoDesc: desc }));
      setSeoGenLoading(false);
    }, 800);
  };

  const save = () => {
    if (!form.name) return;
    const prodData = {
      ...form,
      id: editId || Date.now(),
      price: +form.price || 0,
      oldPrice: Math.round((+form.price || 0) * 1.35),
      cost: +form.cost || 0,
      stock: +form.stock || 0,
      sold: editId ? (products.find(p => p.id === editId)?.sold || 0) : 0,
      status: 'active',
      colors: typeof form.colors === 'string' ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : form.colors,
      rating: editId ? (products.find(p => p.id === editId)?.rating || 0) : 0,
      badge: editId ? (products.find(p => p.id === editId)?.badge || '') : 'Novo'
    };

    if (editId) {
      setProducts(prev => prev.map(p => p.id === editId ? prodData : p));
    } else {
      setProducts(prev => [prodData, ...prev]);
    }

    closeForm();
  };

  const closeForm = () => {
    setForm({ name: '', cat: 'grau', price: '', cost: '', stock: '', desc: '', colors: '', images: [], seoTitle: '', seoDesc: '' });
    setEditId(null);
    setShowForm(false);
  };

  const startEdit = (p) => {
    setForm({
      name: p.name, cat: p.cat, price: p.price, cost: p.cost, stock: p.stock,
      desc: p.desc, colors: p.colors.join(', '), images: p.images || [],
      seoTitle: p.seoTitle || '', seoDesc: p.seoDesc || ''
    });
    setEditId(p.id);
    setShowForm(true);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontFamily: ftD, fontSize: 24, fontWeight: 700, color: C.nv, margin: 0 }}>Produtos ({products.length})</h1>
        <Btn primary onClick={() => setShowForm(true)}>+ Novo Produto</Btn>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 24, border: `2px solid ${C.co}` }}>
          <h3 style={{ fontFamily: ftD, fontSize: 18, marginBottom: 20 }}>{editId ? 'Editar Produto' : 'Novo Produto'}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
            {/* IMAGES COLUMN */}
            <div>
              <label style={{ fontFamily: ft, fontSize: 12, fontWeight: 700, color: C.md, display: 'block', marginBottom: 8 }}>Galeria de Fotos</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.bd}` }}>
                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,0,0,0.7)', color: '#FFF', border: 'none', width: 20, height: 20, borderRadius: '50%', cursor: 'pointer', fontSize: 12 }}>&times;</button>
                  </div>
                ))}
                <div onClick={() => fileRef.current?.click()} style={{ aspectRatio: '1', borderRadius: 10, border: `2px dashed ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: C.cr }}>
                  <span style={{ fontSize: 24, color: C.md }}>+</span>
                </div>
              </div>
              <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
              <p style={{ fontSize: 11, color: C.lt }}>Dica: A primeira foto será a capa do produto.</p>
            </div>

            {/* INFO COLUMN */}
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
                <Inp label="Nome Comercial" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontFamily: ft, fontSize: 12, fontWeight: 600, color: C.md, display: 'block', marginBottom: 5 }}>Categoria</label>
                  <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })} style={{ fontFamily: ft, width: "100%", padding: "11px 14px", border: `1.5px solid ${C.bd}`, borderRadius: 10, fontSize: 14 }}>
                    <option value="grau">Óculos de Grau</option>
                    <option value="sol">Óculos de Sol</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <Inp label="Preço de Venda" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                <Inp label="Custo (Interno)" type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
                <Inp label="Estoque Local" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>

              <Inp label="Cores Disponíveis (separadas por vírgula)" value={form.colors} onChange={e => setForm({ ...form, colors: e.target.value })} placeholder="Preto, Tartaruga, Cristal" />

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontFamily: ft, fontSize: 12, fontWeight: 700, color: C.md }}>Descrição do Produto</label>
                  <button onClick={genDesc} disabled={aiLoading} style={{ fontSize: 11, fontWeight: 700, color: C.co, background: C.coS, border: "none", padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}>
                    {aiLoading ? "Pensando..." : "🪄 Gerar com IA"}
                  </button>
                </div>
                <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={4} style={{ fontFamily: ft, width: "100%", padding: "12px", border: `1.5px solid ${C.bd}`, borderRadius: 10, fontSize: 13, resize: "vertical" }} />
              </div>

              {/* SEO SECTION */}
              <div style={{ background: '#F9FAFB', padding: 16, borderRadius: 12, border: `1px solid ${C.bd}`, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.nv }}>Otimização SEO (Google)</h4>
                  <button onClick={genSEO} disabled={seoGenLoading} style={{ fontSize: 10, fontWeight: 700, color: C.sg, background: `${C.sg}20`, border: "none", padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}>
                    {seoGenLoading ? "Analisando..." : "⚡ Gerar SEO IA"}
                  </button>
                </div>
                <Inp label="Título SEO (Meta Title)" value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} />
                <Inp label="Meta Descrição" value={form.seoDesc} onChange={e => setForm({ ...form, seoDesc: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <Btn primary onClick={save} style={{ flex: 2 }}>{editId ? 'Atualizar Produto' : 'Publicar Produto'}</Btn>
                <Btn onClick={closeForm} style={{ flex: 1 }}>Cancelar</Btn>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: ft }}>
          <thead style={{ background: '#F9FAFB' }}>
            <tr style={{ borderBottom: `1px solid ${C.bd}` }}>
              {["Produto", "Categoria", "Preço", "Estoque", "Vendas", ""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "16px", fontSize: 11, fontWeight: 700, color: C.md, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${C.bd}` }}>
                <td style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={p.images?.[0] || p.img} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", border: `1px solid ${C.bd}` }} />
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.nv, display: 'block' }}>{p.name}</span>
                    <span style={{ fontSize: 11, color: C.lt }}>ID: {p.id}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}><Badge color={p.cat === 'grau' ? C.ig : C.gl}>{p.cat}</Badge></td>
                <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: C.nv }}>{fm(p.price)}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: p.stock < 10 ? C.dn : C.nv }}>{p.stock}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 14, color: C.md }}>{p.sold}</td>
                <td style={{ padding: "12px 16px", textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => startEdit(p)} style={{ background: 'none', border: `1px solid ${C.bd}`, padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Editar</button>
                    <button onClick={() => setProducts(ps => ps.filter(x => x.id !== p.id))} style={{ background: C.dnS, border: "none", width: 30, height: 30, borderRadius: 8, cursor: "pointer", color: C.dn }}>&times;</button>
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
