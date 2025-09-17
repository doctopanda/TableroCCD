require('dotenv').config();
const express = require('express');
const cors = require('cors');
const uploads = require('./routes/uploads');
const forms = require('./routes/forms');
const supabaseAdmin = require('./utils/supabaseAdmin');

const app = express();
app.use(cors());
app.use(express.json());

// Basic health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Expose role
app.get('/api/role', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });
    const token = authHeader.split(' ')[1];

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error) return res.status(401).json({ error: error.message });

    const userId = data.user.id;
    const { data: roleData, error: roleErr } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (roleErr && roleErr.code === 'PGRST116') {
      return res.json({ role: 'administrador' });
    }
    if (roleErr) return res.json({ role: 'visualizador' });
    res.json({ role: roleData?.role || 'visualizador' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.use('/api', uploads);
app.use('/api', forms);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
const path = require('path');
const frontendPath = path.join(__dirname, 'frontend-dist');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});