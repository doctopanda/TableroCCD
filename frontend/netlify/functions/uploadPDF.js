// netlify/functions/uploadPDF.js
import { createClient } from "@supabase/supabase-js";
import multiparty from "multiparty";
import fs from "fs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  return new Promise((resolve) => {
    const form = new multiparty.Form();

    form.parse(event, async (err, fields, files) => {
      if (err) {
        return resolve({ statusCode: 500, body: "Error al procesar archivo" });
      }

      const file = files.file?.[0];
      if (!file) {
        return resolve({ statusCode: 400, body: "No se encontró archivo" });
      }

      try {
        const fileBuffer = fs.readFileSync(file.path);
        const fileName = `uploads/${Date.now()}-${file.originalFilename}`;

        const { error } = await supabase.storage
          .from("pdfs")
          .upload(fileName, fileBuffer, {
            contentType: "application/pdf",
            upsert: true,
          });

        if (error) {
          return resolve({ statusCode: 500, body: JSON.stringify(error) });
        }

        // ⚡ Construir URL pública
        const publicUrl = `${process.env.SUPABASE_URL.replace(
          ".supabase.co",
          ".supabase.co/storage/v1/object/public"
        )}/pdfs/${fileName}`;

        resolve({
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            url: publicUrl,
          }),
        });
      } catch (uploadError) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: uploadError.message }),
        });
      }
    });
  });
};
