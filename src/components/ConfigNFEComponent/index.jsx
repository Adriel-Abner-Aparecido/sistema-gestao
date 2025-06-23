import React, { useState } from 'react';
import { post } from "../../services/api"; // Certifique-se de que o post está corretamente importado

export const FormNfeEmpresa = () => {
  // Estado para armazenar os dados do formulário
  const [nfeData, setNfeData] = useState({
    nfe_serie: '',
    nfe_numero: '',
    nfe_numero_dev: '',
    informacoes_fisco: '',
    cnae_issqn: ''
  });

  const [responseMessage, setResponseMessage] = useState(''); // Estado para a resposta

  // Função para manipular as mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNfeData({
      ...nfeData,
      [name]: value
    });
  };

  // Função para enviar os dados para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const empresa = { /* insira aqui os dados da empresa que já existem, se necessário */ };

    const requestData = {
      nfe_serie: nfeData.nfe_serie || empresa.nfe_serie,
      nfe_numero: nfeData.nfe_numero || empresa.nfe_numero,
      nfe_numero_dev: nfeData.nfe_numero_dev || empresa.nfe_numero_dev,
      informacoes_fisco: nfeData.informacoes_fisco || empresa.informacoes_fisco,
      cnae_issqn: nfeData.cnae_issqn || empresa.cnae_issqn
    };

    try {
      const response = await post(`${process.env.NEXT_PUBLIC_API_URL}/atualizar-config-nfe`, requestData);
      setResponseMessage(response.data.message || 'Configuração de NF-e atualizada com sucesso');
    } catch (error) {
      setResponseMessage('Erro ao atualizar a configuração de NF-e. Por favor, tente novamente.');
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
        {/* Série da NF-e */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Série da NF-e</label>
          <input type="text" name="nfe_serie" value={nfeData.nfe_serie} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Número de série da NF-e" />
        </div>

        {/* Número da próxima NF-e */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Número da próxima NF-e</label>
          <input type="text" name="nfe_numero" value={nfeData.nfe_numero} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Número da próxima nota fiscal" />
        </div>

        {/* Número da próxima NF-e em ambiente de homologação */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Número da próxima NF-e (Ambiente de Homologação)</label>
          <input type="text" name="nfe_numero_dev" value={nfeData.nfe_numero_dev} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Número da próxima nota fiscal (homologação)" />
        </div>

        {/* Informações ao Fisco */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Informações ao Fisco</label>
          <textarea name="informacoes_fisco" value={nfeData.informacoes_fisco} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Informações adicionais ao Fisco" />
        </div>

        {/* CNAE da atividade principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700">CNAE da atividade principal</label>
          <input type="text" name="cnae_issqn" value={nfeData.cnae_issqn} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Código CNAE" />
        </div>

        {/* Botão para enviar o formulário */}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >
          Atualizar Configuração NF-e
        </button>
      </form>
    </div>
  );
};
