import React, { useState } from 'react';
import { post } from "../../services/api"; // Certifique-se de que o post está corretamente importado

export const FormNfceEmpresa = () => {
  // Estado para armazenar os dados do formulário
  const [nfceData, setNfceData] = useState({
    nfce_serie: '',
    nfce_numero: '',
    nfce_numero_dev: '',
    nfce_id_csc: '',
    nfce_codigo_csc: '',
    informacoes_fisco: '',
    cnae_issqn: ''
  });

  const [responseMessage, setResponseMessage] = useState(''); // Estado para a resposta

  // Função para manipular as mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNfceData({
      ...nfceData,
      [name]: value
    });
  };

  // Função para enviar os dados para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const empresa = { /* insira aqui os dados da empresa que já existem, se necessário */ };

    const requestData = {
      nfce_serie: nfceData.nfce_serie || empresa.nfce_serie,
      nfce_numero: nfceData.nfce_numero || empresa.nfce_numero,
      nfce_numero_dev: nfceData.nfce_numero_dev || empresa.nfce_numero_dev,
      nfce_id_csc: nfceData.nfce_id_csc || empresa.nfce_id_csc,
      nfce_codigo_csc: nfceData.nfce_codigo_csc || empresa.nfce_codigo_csc,
      informacoes_fisco: nfceData.informacoes_fisco || empresa.informacoes_fisco,
      cnae_issqn: nfceData.cnae_issqn || empresa.cnae_issqn
    };

    try {
      const response = await post(`${process.env.NEXT_PUBLIC_API_URL}/atualizar-config-nfce`, requestData);
      setResponseMessage(response.data.message || 'Configuração de NFC-e atualizada com sucesso');
    } catch (error) {
      setResponseMessage('Erro ao atualizar a configuração de NFC-e. Por favor, tente novamente.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto">
      {/* Mensagem de resposta */}
      {responseMessage && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 text-gray-700">
          {responseMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Série da NFC-e */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Série da NFC-e</label>
          <input type="text" name="nfce_serie" value={nfceData.nfce_serie} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Número de série da NFC-e" />
        </div>

        {/* Número da próxima NFC-e */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Número da próxima NFC-e</label>
          <input type="text" name="nfce_numero" value={nfceData.nfce_numero} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Número da próxima nota fiscal" />
        </div>

        {/* Número da próxima NFC-e em ambiente de homologação */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Número da próxima NFC-e (Ambiente de Homologação)</label>
          <input type="text" name="nfce_numero_dev" value={nfceData.nfce_numero_dev} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Número da próxima nota fiscal (homologação)" />
        </div>

        {/* ID do CSC da NFC-e */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ID do CSC da NFC-e</label>
          <input type="text" name="nfce_id_csc" value={nfceData.nfce_id_csc} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="ID do CSC (Código de Segurança do Contribuinte)" />
        </div>

        {/* Código do CSC da NFC-e */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Código do CSC da NFC-e</label>
          <input type="text" name="nfce_codigo_csc" value={nfceData.nfce_codigo_csc} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Código do CSC" />
        </div>

        {/* Informações ao Fisco */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Informações ao Fisco</label>
          <textarea name="informacoes_fisco" value={nfceData.informacoes_fisco} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Informações adicionais ao Fisco" />
        </div>

        {/* CNAE da atividade principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700">CNAE da atividade principal</label>
          <input type="text" name="cnae_issqn" value={nfceData.cnae_issqn} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Código CNAE" />
        </div>

        {/* Botão para enviar o formulário */}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >
          Atualizar Configuração NFC-e
        </button>
      </form>
    </div>
  );
};
