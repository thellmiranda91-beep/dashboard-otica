export const BANNERS_INIT = [
  { id: 1, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&h=400&fit=crop', title: 'Coleção Elior 2024', desc: 'Leveza e estilo em cada detalhe.', link: '/catalog', cat: 'home' },
  { id: 2, img: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1200&h=400&fit=crop', title: 'Lentes Premium', desc: 'Tecnologia Zeno para sua visão.', link: '/product/1', cat: 'home' }
];

export const INIT_PRODS = [
  {id:1,name:"Elior Classic",cat:"grau",price:289,oldPrice:389,cost:85,stock:48,sold:1247,status:"active",images:["https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop"],desc:"Armação acetato premium com design atemporal.",colors:["Preto","Tartaruga","Dourado"],rating:4.8,badge:"Mais vendido",seoTitle:"Elior Classic - Óculos de Grau Minimalista",seoDesc:"Compre o Elior Classic em acetato premium. Design atemporal e leveza garantida."},
  {id:2,name:"Elior Aviator",cat:"sol",price:349,oldPrice:449,cost:92,stock:35,sold:983,status:"active",images:["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop"],desc:"Aviador com lentes polarizadas UV400.",colors:["Dourado","Prata","Preto"],rating:4.9,badge:"Top rated",seoTitle:"Elior Aviator - Óculos de Sol Polarizado",seoDesc:"Estilo clássico aviador com proteção UV400 completa."},
  {id:3,name:"Elior Round",cat:"grau",price:259,oldPrice:339,cost:72,stock:62,sold:756,status:"active",images:["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop"],desc:"Titânio ultraleve. Conforto excepcional.",colors:["Preto","Rose","Azul"],rating:4.7,badge:""},
  {id:4,name:"Elior Square",cat:"sol",price:319,oldPrice:419,cost:88,stock:13,sold:621,status:"active",images:["https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop"],desc:"Design quadrado com lentes degradê.",colors:["Preto","Marrom","Verde"],rating:4.8,badge:"Últimas unidades"},
  {id:5,name:"Elior Cat Eye",cat:"grau",price:299,oldPrice:399,cost:80,stock:47,sold:534,status:"active",images:["https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&h=400&fit=crop"],desc:"Cat eye sofisticado em acetato italiano.",colors:["Tartaruga","Preto","Vinho"],rating:4.9,badge:""},
  {id:6,name:"Elior Wayfarer",cat:"sol",price:279,oldPrice:379,cost:68,stock:75,sold:892,status:"active",images:["https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&h=400&fit=crop"],desc:"Wayfarer com lentes polarizadas.",colors:["Preto","Azul","Havana"],rating:4.6,badge:"Oferta"},
  {id:7,name:"Elior Titanium",cat:"grau",price:449,oldPrice:599,cost:140,stock:24,sold:312,status:"active",images:["https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=400&h=400&fit=crop"],desc:"Titânio puro japonês. Máxima leveza.",colors:["Grafite","Dourado","Prata"],rating:5.0,badge:"Premium"},
  {id:8,name:"Elior Sport",cat:"sol",price:339,oldPrice:449,cost:95,stock:39,sold:445,status:"active",images:["https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=400&fit=crop"],desc:"Lentes fotocromáticas, armação flexível.",colors:["Preto","Vermelho","Branco"],rating:4.7,badge:""},
];

export const USAGE_OPTIONS = [
  { id: 'com_grau', label: 'Lentes com grau', desc: 'Faremos suas lentes de grau de acordo com sua receita', badge: 'Mais vendido', icon: '🕶️' },
  { id: 'sem_grau', label: 'Lentes sem grau', desc: 'Proteção de telas ou uso estético', icon: '💻' },
  { id: 'leitura',  label: 'Grau para leitura', desc: 'Dificuldade para ler de perto', icon: '📖' },
  { id: 'armacao',  label: 'Somente a armação', desc: 'Sem lentes', icon: '👓' },
];

export const BUMPS = [
  {id:"b1",name:"Antirreflexo",price:89},
  {id:"b2",name:"Luz Azul",price:69},
  {id:"b3",name:"Fotocromática",price:129}
];

export const CROSS_ITEMS = [
  {id:"c1",name:"Estojo Premium",price:79,img:"/assets/case.png"},
  {id:"c2",name:"Kit Limpeza",price:49},
  {id:"c3",name:"Cordão",price:39},
  {id:"garantia",name:"Garantia Estendida (1 ano)",price:89.90},
  {id:"combo4",name:"Combo 4 Óculos de Sol",price:79.90,img:"/assets/combo4.png"}
];

export const LENS_OPTIONS_DEFAULT = [
  { 
    id: 'fina', 
    label: 'Lente Fina', 
    price: 175, 
    specs: ['Esférico +3,00 a -3,00', 'Cilíndrico até -2,00', 'Antirreflexo incluso', 'Leve e resistente'],
    delivery: '2 a 5 dias úteis',
    img: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=100&h=100&fit=crop'
  },
  { 
    id: 'super_fina', 
    label: 'Lente Super Fina', 
    price: 450, 
    specs: ['Esférico +6,00 a -6,00', 'Cilíndrico até -4,00', 'Antirreflexo incluso', 'Extra leve e fina'],
    delivery: '3 a 6 dias úteis',
    img: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=100&h=100&fit=crop'
  }
];

export const EXTRA_TREATMENTS_DEFAULT = [
  { id: 'ar_only', label: 'Apenas antirreflexo', price: 0, desc: 'Bloqueia os reflexos indesejados\nVisão mais nítida e confortável', status: 'INCLUSO', delivery: '2 a 5 dias úteis' },
  { id: 'blue_block', label: 'Zeno Total Blue Block', price: 47, desc: 'Filtra luz azul UV de telas\nReduz cansaço ocular\nAntirreflexo incluso', status: 'Mais vendido', delivery: '2 a 5 dias úteis' },
  { id: 'photo', label: 'Fotossensível', price: 149, desc: 'Escurece ao sol, clareia em ambientes fechados\nProtege contra UVA/UVB\nAntirreflexo + Filtro Azul inclusos', delivery: '5 a 8 dias úteis' }
];

export const TESTIMONIALS = [
  {name:"Maria S.",city:"SP",text:"Qualidade incrível!",rating:5},
  {name:"Carlos R.",city:"RJ",text:"Melhor custo-benefício!",rating:5},
  {name:"Ana L.",city:"BH",text:"Meu terceiro Elior!",rating:5},
  {name:"Pedro M.",city:"CWB",text:"Atendimento top!",rating:5}
];

export const MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
export const REV_DATA = [42800,51200,48900,63400,72100,68300,81200,94500,88700,102300,115600,128900];
export const COST_DATA = [18200,21800,20700,26900,30600,29000,34500,40100,37700,43400,49100,54700];

export const FUNNELS_INIT = [
  {id:"f1",name:"Carrinho abandonado — WhatsApp",type:"abandono",channel:"whatsapp",active:true,sent:2847,converted:741,revenue:214890,steps:[{delay:"30min",msg:"Oi {{nome}}! Seus óculos estão no carrinho 👓",type:"lembrete"},{delay:"4h",msg:"Cupom VOLTE10: 10% OFF ⏰",type:"cupom"},{delay:"24h",msg:"Última chance! 🔥",type:"urgência"}]},
  {id:"f2",name:"Carrinho abandonado — Email",type:"abandono",channel:"email",active:true,sent:2847,converted:342,revenue:99078,steps:[{delay:"1h",msg:"Seus óculos estão esperando",type:"lembrete"},{delay:"6h",msg:"Cupom 10% OFF",type:"cupom"},{delay:"48h",msg:"Últimas unidades!",type:"urgência"}]},
  {id:"f3",name:"Pós-compra — Recompra",type:"recompra",channel:"whatsapp",active:true,sent:4790,converted:614,revenue:178060,steps:[{delay:"Imediato",msg:"Pedido confirmado! ✅",type:"confirmação"},{delay:"15 dias",msg:"Avalie e ganhe 15% OFF ⭐",type:"recompra"}]},
  {id:"f4",name:"Lead nurturing — Email",type:"captação",channel:"email",active:true,sent:3840,converted:892,revenue:258280,steps:[{delay:"Imediato",msg:"Bem-vindo! Cupom 15% OFF 🎉",type:"captação"},{delay:"7 dias",msg:"Cupom expira amanhã!",type:"urgência"}]},
];

export const MSG_TEMPLATES = [
  {id:"t1",name:"Boas-vindas WA",channel:"whatsapp",content:"Olá {{nome}}! 👋 Bem-vindo à Elior. Cupom BEMVINDO15: 15% OFF!"},
  {id:"t2",name:"Carrinho WA",channel:"whatsapp",content:"Oi {{nome}}! Seus óculos {{produto}} estão no carrinho 👓"},
  {id:"t3",name:"Boas-vindas Email",channel:"email",subject:"Bem-vindo à Elior! 🎉",content:"Olá {{nome}},\n\nUse BEMVINDO15 na primeira compra.\n\nEquipe Elior"},
  {id:"t4",name:"Carrinho Email",channel:"email",subject:"Seus óculos estão esperando!",content:"Olá {{nome}},\n\nVocê deixou o {{produto}} no carrinho.\nUse VOLTE10 para 10% OFF."},
];

export const MSG_LOG_INIT = [
  {id:"m1",to:"+55 11 99999-1234",channel:"whatsapp",template:"Carrinho",status:"delivered",date:"14/04 10:32",opened:true},
  {id:"m2",to:"maria@email.com",channel:"email",template:"Boas-vindas",status:"delivered",date:"14/04 09:15",opened:true},
  {id:"m3",to:"+55 21 98888-5678",channel:"whatsapp",template:"Confirmação",status:"sent",date:"13/04 18:44",opened:false},
];

export const INIT_USERS = [
  {id:1,username:"teomiranda",password:"123456",name:"Teo Miranda",role:"admin",email:"teo@elior.com.br",active:true,lastLogin:"14/04/2026 08:30"},
];
