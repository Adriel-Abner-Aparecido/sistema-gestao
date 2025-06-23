import React, { useState } from 'react';
import { post } from "../../services/api";
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';

export const UploadCertificado = () => {
  const [certificado, setCertificado] = useState(null);
  const [certificadoSenha, setCertificadoSenha] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(false)
  const [message, setMessage] = useState(undefined)

  // Função para manipular o arquivo do certificado
  const handleCertificadoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Converte o arquivo para Base64

      reader.onload = () => {
        setCertificado(reader.result.split(',')[1]); // Obtém a parte Base64 do arquivo
      };

      reader.onerror = () => {
        console.error('Erro ao carregar o certificado.');
        alert('Erro ao carregar o certificado. Tente novamente.');
      };
    }
  };

  // Função para enviar o certificado e a senha para a API
  const handleUpload = async () => {
    if (!certificado || !certificadoSenha) {
      alert('Por favor, insira o certificado e a senha.');
      return;
    }

    try {
      const response = await post(`${process.env.NEXT_PUBLIC_API_URL}/atualizar-certificado`, {
        certificado,
        certificado_senha: certificadoSenha
      });

      if (response.data.message === 'Certificado atualizado com sucesso') {
        setUploadSuccess(true);
        setMessage('Certificado digital A1 instalado com sucesso.');
      } else {
        setError(true)
        setMessage('Erro ao atualizar o certificado.');
      }
    } catch (error) {
      console.error('Erro ao enviar o certificado:', error);
      setError(true)
      setMessage('Erro ao enviar o certificado. Tente novamente.');
    }
  };

  return (
    <>
      {
        error && message && (
          <div className="flex flex-row items-center py-3 gap-3 bg-red-100 rounded-lg">
            <BsExclamationCircle className='w-9 h-9 text-red-600' />
            <div className="certificate-thumb-title">{message}</div>
          </div>
        )
      }
      {
        uploadSuccess && message && (
          <div className="flex flex-row items-center py-3 gap-3 bg-green-100 rounded-lg">
            <BsCheckCircle className='w-9 h-9 text-green-600' />
            <div className="certificate-thumb-title">{message}</div>
          </div>
        )
      }

      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className='flex'>
          <div className='flex flex-col gap-2'>
            <label className="block text-sm font-medium text-black">Certificado A1 (.pfx)</label>
            <div className="flex-1">
              <input type="file" accept=".pfx" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 bg-white border-gray-500 text-black" onChange={handleCertificadoUpload} />
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label className="block text-sm font-medium text-black">Senha do Certificado</label>
          <div className="flex-1">
            <input type="password" value={certificadoSenha} onChange={(e) => setCertificadoSenha(e.target.value)} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 h-full bg-white border-gray-500 text-black" />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2 py-3'>
        <div className="flex-1">
          <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Enviar Certificado
          </button>
        </div>
      </div>
    </>

  );
};
