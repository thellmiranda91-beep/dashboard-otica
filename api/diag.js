import { supabase, cors, handleOptions } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  cors(res);

  const status = {
    env: {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
      MP_ACCESS_TOKEN: !!process.env.MP_ACCESS_TOKEN,
    },
    database: 'Checking...',
  };

  try {
    const { data, error } = await supabase.from('customers').select('count', { count: 'exact' });
    if (error) throw error;
    status.database = `OK (Total customers: ${data[0]?.count || 0})`;
  } catch (err) {
    status.database = `ERROR: ${err.message}`;
  }

  return res.status(200).json(status);
}
