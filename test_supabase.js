import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('--- Testando Supabase com Service Role Correta ---');
console.log('URL:', SUPABASE_URL);
console.log('Service Role Key:', SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurada' : '❌ Não configurada');

try {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
  } else {
    console.log('❌ Erro ao conectar:', response.statusText);
  }
} catch (error) {
  console.error('❌ Erro:', error.message);
}
