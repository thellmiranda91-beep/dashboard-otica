// POST /api/auth/login
// Admin authentication with JWT

import { supabase, cors, handleOptions } from '../_lib/supabase.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  cors(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e senha são obrigatórios' });
  }

  try {
    // Find user
    const { data: user } = await supabase
      .from('users')
      .select('id, username, name, email, role, active, password_hash')
      .eq('username', username)
      .eq('active', true)
      .single();

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }

    // Verify password (using bcrypt via Supabase RPC or simple comparison for MVP)
    // For production, use bcrypt. For MVP, direct comparison:
    const bcrypt = await import('bcryptjs');
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }

    // Generate JWT
    const jwt = await import('jsonwebtoken');
    const token = jwt.default.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
