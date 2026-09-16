"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Documento = {
  id: string;
  tipo: string;
  status: string;
  criadoEm: string;
};

const TIPOS = [
  { value: "RG_CNH", label: "RG ou CNH" },
  { value: "COMPROVANTE_ENDERECO", label: "Comprovante de Endereco" },
  { value: "CERTIFICADO", label: "Certificado" },
];

export default function DocumentosCandidato() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [tipo, setTipo] = useState("RG_CNH");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);

  function carregar() {
    fetch("/api/candidato/documentos")
      .then((r) => r.json())
      .then((data) => {
        setDocumentos(data.documentos || []);
        setCarregando(false);
      });
  }

  useEffect(carregar, []);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivo) return;
    setEnviando(true);
    setMensagem("");

    const extensao = arquivo.name.split(".").pop()?.toLowerCase();
    if (!extensao || !["pdf", "jpg", "jpeg", "png"].includes(extensao)) {
      setMensagem("Formato invalido. Use PDF, JPG ou PNG.");
      setEnviando(false);
      return;
    }

    const respostaUrl = await fetch("/api/candidato/documentos/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ extensao }),
    });

    if (!respostaUrl.ok) {
      setMensagem("Erro ao preparar upload.");
      setEnviando(false);
      return;
    }

    const { storagePath, token } = await respostaUrl.json();

    const { error: erroUpload } = await supabaseBrowser.storage
      .from("documentos-candidatos")
      .uploadToSignedUrl(storagePath, token, arquivo);

    if (erroUpload) {
      setMensagem("Erro ao enviar arquivo: " + erroUpload.message);
      setEnviando(false);
      return;
    }

    const respostaRegistro = await fetch("/api/candidato/documentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, storagePath }),
    });

    setEnviando(false);
    if (respostaRegistro.ok) {
      setMensagem("Documento enviado com sucesso.");
      setArquivo(null);
      carregar();
    } else {
      setMensagem("Erro ao registrar documento.");
    }
  }

  const STATUS_LABEL: Record<string, string> = {
    PENDENTE: "Em analise",
    VERIFICADO: "Verificado",
    REJEITADO: "Rejeitado",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-deep-black">Documentos</h1>

      <form onSubmit={enviar} className="glass rounded-card p-6 border border-white space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo de documento</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow"
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Arquivo (PDF, JPG ou PNG)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setArquivo(e.target.files?.[0] || null)}
            className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg"
          />
        </div>

        {mensagem && <p className="text-sm text-gray-600">{mensagem}</p>}

        <button
          type="submit"
          disabled={enviando || !arquivo}
          className="bg-deep-black text-white font-bold px-6 py-3 rounded-pill hover:bg-gray-900 transition disabled:opacity-50"
        >
          {enviando ? "Enviando..." : "Enviar Documento"}
        </button>
      </form>

      <div className="glass rounded-card p-6 border border-white">
        <h2 className="font-bold text-deep-black mb-4">Documentos enviados</h2>
        {carregando ? (
          <p className="text-gray-500 text-sm">Carregando...</p>
        ) : documentos.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum documento enviado ainda.</p>
        ) : (
          <div className="space-y-2">
            {documentos.map((d) => (
              <div key={d.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                <span className="font-medium text-deep-black">{d.tipo.replace("_", " ")}</span>
                <span className="text-gray-500">{STATUS_LABEL[d.status]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}