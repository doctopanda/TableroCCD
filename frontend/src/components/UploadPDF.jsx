// frontend/src/components/UploadPDF.jsx
import { useState } from "react";

export default function UploadPDF({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Solo se permiten archivos PDF 📄");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Selecciona un PDF primero");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/.netlify/functions/uploadPDF", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setPdfUrl(data.url);
        alert("✅ PDF subido con éxito");

        // 🔗 abrir directamente el PDF en otra pestaña
        if (data.url) {
          window.open(data.url, "_blank");
        }

        // devolver info al padre (ej: Dashboard/Estadísticas)
        onUpload && onUpload(data);
      } else {
        alert("❌ Error al subir el PDF");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Hubo un error al subir el PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg shadow bg-white">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="border p-2 rounded"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`${
          loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        } text-white px-4 py-2 rounded`}
      >
        {loading ? "Subiendo..." : "Subir PDF"}
      </button>

      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Ver PDF subido
        </a>
      )}
    </div>
  );
}
