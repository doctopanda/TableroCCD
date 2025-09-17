const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseAdmin');

// List templates
router.get('/templates', async (req, res) => {
  try {
    const { data, error } = await supabase.from('form_templates').select('*').order('created_at', { ascending: false });
    if(error) throw error;
    res.json({ data });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single template
router.get('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('form_templates').select('*').eq('id', id).single();
    if(error) throw error;
    res.json({ data });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Update template (fields config)
router.put('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fields_config, name } = req.body;
    const { error } = await supabase.from('form_templates').update({ fields_config, name }).eq('id', id);
    if(error) throw error;
    res.json({ ok: true });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete template (and submissions)
router.delete('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Delete submissions
    await supabase.from('form_submissions').delete().eq('template_id', id);
    // Get template to remove file
    const { data: tData, error: tErr } = await supabase.from('form_templates').select('pdf_storage_path').eq('id', id).single();
    if(tErr) throw tErr;
    if(tData?.pdf_storage_path) {
      await supabase.storage.from(process.env.BUCKET_NAME || 'form-pdfs').remove([tData.pdf_storage_path]);
    }
    const { error } = await supabase.from('form_templates').delete().eq('id', id);
    if(error) throw error;
    res.json({ ok: true });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
