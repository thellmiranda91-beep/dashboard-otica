import { C, ft, ftD, fm } from '../config/theme.js';
import { Btn, Stars } from '../components/ui.jsx';
import { useMobile } from '../hooks/useMobile.js';
import { TESTIMONIALS } from '../config/data.js';
import { ProdCard } from './ProductCard.jsx';

export function Hero({ banners, setPage, setFilter }) {
  const isMobile = useMobile();
  const b = banners?.[0] || { title: 'Seu olhar merece o melhor.', desc: 'Design premium, lentes de alta tecnologia.', img: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1100&h=600&fit=crop' };
  
  return (
    <div style={{background:C.cr,padding: isMobile ? "40px 20px" : "72px 24px", minHeight: isMobile ? "auto" : "80vh", display: "flex", alignItems: "center"}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",gap: isMobile ? 32 : 40,alignItems:"center"}}>
        <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
          <span style={{fontFamily:ft,fontSize:10,fontWeight:600,letterSpacing:3,color:C.sg,display:"block",marginBottom:14}}>EXCLUSIVO ELIOR</span>
          <h1 style={{fontFamily:ftD,fontSize: isMobile ? 34 : "clamp(34px,5vw,52px)",fontWeight:700,color:C.nv,lineHeight:1.1,marginBottom:18,letterSpacing:-1}}>{b.title}</h1>
          <p style={{fontFamily:ft,fontSize:15,color:C.md,lineHeight:1.6,marginBottom:28,maxWidth: isMobile ? "none" : 420, margin: isMobile ? "0 auto 28px" : "0 0 28px"}}>{b.desc}</p>
          <div style={{display:"flex",gap:12, justifyContent: isMobile ? "center" : "flex-start"}}>
            <Btn primary onClick={() => {setPage("catalog");setFilter("all")}}>Ver coleção</Btn>
            {!isMobile && <Btn onClick={() => {setPage("catalog");setFilter("grau")}}>Óculos de grau</Btn>}
          </div>
        </div>
        <div style={{background:C.wh,borderRadius:24,overflow:"hidden",aspectRatio:"16/9",boxShadow:"0 24px 48px rgba(12,31,46,0.08)", width: "100%", order: isMobile ? -1 : 1}}>
          <img src={b.img} alt="Elior Banner" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </div>
      </div>
    </div>
  );
}

export function OfferBanner({ cH, cM, cS, setPage, setFilter }) {
  const isMobile = useMobile();
  return (
    <div style={{margin: isMobile ? "0 16px" : "0 24px",borderRadius:20,background:`linear-gradient(135deg,${C.nv},${C.nvL})`,padding: isMobile ? "32px 20px" : "48px 36px",textAlign:"center"}}>
      <h2 style={{fontFamily:ftD,fontSize: isMobile ? 24 : 30,fontWeight:700,color:C.wh,marginBottom:6}}>2 óculos por {fm(499)}</h2>
      <p style={{fontFamily:ft,fontSize:13,color:"rgba(255,255,255,.5)",marginBottom:24}}>Termina em {cH}:{cM}:{cS}</p>
      <Btn primary onClick={() => {setPage("catalog");setFilter("all")}} full={isMobile}>Garantir oferta</Btn>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <div style={{padding:"48px 24px",background:C.cr,marginTop:48}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <h2 style={{fontFamily:ftD,fontSize:24,fontWeight:700,color:C.nv,textAlign:"center",marginBottom:24}}>Clientes satisfeitos</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
          {TESTIMONIALS.map((t,i) => (
            <div key={i} style={{background:C.wh,borderRadius:14,padding:18,border:`1px solid ${C.bd}`}}>
              <Stars r={t.rating} s={12}/>
              <p style={{fontFamily:ft,fontSize:13,lineHeight:1.5,margin:"8px 0",color:C.tx}}>"{t.text}"</p>
              <p style={{fontFamily:ft,fontSize:12,fontWeight:600,color:C.nv,margin:0}}>{t.name} — {t.city}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomePage({ products, setPage, setFilter, openProd, cH, cM, cS, banners }) {
  return (
    <>
      <Hero banners={banners} setPage={setPage} setFilter={setFilter} />
      <div style={{padding:"48px 24px",maxWidth:1100,margin:"0 auto"}}>
        <h2 style={{fontFamily:ftD,fontSize:28,fontWeight:700,color:C.nv,textAlign:"center",marginBottom:24}}>Mais vendidos</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18}}>
          {products.filter(p => p.sold > 700).slice(0,4).map(p => <ProdCard key={p.id} p={p} onClick={() => openProd(p)}/>)}
        </div>
      </div>
      <OfferBanner cH={cH} cM={cM} cS={cS} setPage={setPage} setFilter={setFilter} />
      <TestimonialsSection />
      <div style={{padding:"48px 24px",maxWidth:1100,margin:"0 auto"}}>
        <h2 style={{fontFamily:ftD,fontSize:28,fontWeight:700,color:C.nv,textAlign:"center",marginBottom:24}}>Coleção</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18}}>
          {products.filter(p => p.status === "active").map(p => <ProdCard key={p.id} p={p} onClick={() => openProd(p)}/>)}
        </div>
      </div>
    </>
  );
}
