const express = require('express');
const multer = require('multer');
const router = express.Router();
const supabase = require('../utils/supabaseAdmin');
const { v4: uuidv4 } = require('uuid');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
    const name = req.body.name || file.originalname;
    if(!file) return res.status(400).json({ error: 'No file' });

    const bucket = process.env.BUCKET_NAME || 'form-pdfs';
    const key = `${uuidv4()}-${file.originalname}`;

    const { error: upError } = await supabase.storage.from(bucket).upload(key, file.buffer, { contentType: file.mimetype, upsert: false });
    if(upError) {
      console.error('Upload error', upError);
      return res.status(500).json({ error: upError.message });
    }

    // make public url (or keep private and use signed URLs)
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(key);

    // Create a template entry in DB
    const template = {
      name,
      pdf_filename: file.originalname,
      pdf_storage_path: key,
      fields_config: [],
      created_at: new Date().toISOString()
    };

    const { data: inserted, error: insertErr } = await supabase.from('form_templates').insert([template]).select().single();
    if(insertErr) {
      console.error('Insert template error', insertErr);
      return res.status(500).json({ error: insertErr.message });
    }

    res.json({ message: 'ok', templateId: inserted.id, publicUrl: urlData.publicUrl });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
