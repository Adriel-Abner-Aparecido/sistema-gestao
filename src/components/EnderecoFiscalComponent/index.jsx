import React, { useState } from 'react';
import { post } from "../../services/api"; // Certifique-se que o post está importado corretamente

export const FormEnderecoEmpresa = ({ data, setData, submit, responseMessage }) => {

  // Função para manipular as mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  // Função para enviar os dados para o backend

  return (
    <div className="container mx-auto">
      {/* Mensagem de resposta */}
      {responseMessage && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 text-gray-700">
          {responseMessage}
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        {/* CEP */}
        <div>
          <label className="block text-sm font-medium text-gray-700">CEP</label>
          <input type="text" name="cep" value={data.cep} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="00000-000" />
        </div>

        {/* Endereço */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Endereço</label>
          <input type="text" name="endereco" value={data.endereco} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Rua, Avenida, etc." />
        </div>

        {/* Número */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Número</label>
          <input type="text" name="numero" value={data.numero} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Número do endereço" />
        </div>

        {/* Complemento */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Complemento</label>
          <input type="text" name="complemento" value={data.complemento} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Apto, Bloco, etc." />
        </div>

        {/* Bairro */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bairro</label>
          <input type="text" name="bairro" value={data.bairro} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Bairro" />
        </div>

        {/* Cidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Cidade</label>
          <input type="text" name="cidade" value={data.cidade} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Cidade" />
        </div>

        {/* UF */}
        <div>
          <label className="block text-sm font-medium text-gray-700">UF</label>
          <input type="text" name="uf" value={data.uf} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Estado (UF)" />
        </div>

        {/* Botão para enviar o formulário */}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >
          Atualizar Endereço
        </button>
      </form>
    </div>
  );
};
