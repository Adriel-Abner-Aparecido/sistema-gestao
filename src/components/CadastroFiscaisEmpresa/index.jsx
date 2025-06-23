import React, { useState } from 'react';
import { get, post } from "../../services/api";
import InputMask from 'react-input-mask';

export const FormEmpresaWebmania = ({ data, setData, submit, responseMessage }) => {

  const [buscar, setBuscar] = useState(true)

  // Função para manipular as mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const buscaDadosCnpj = async (event) => {

    const { value } = event.target

    const numberCnpj = value.replace(/\D/g, '')

    setData({ ...data, cnpj: value })

    if (numberCnpj.length === 14) {
      if (buscar) {
        try {
          const dadosDaEmpresa = await get(`${process.env.NEXT_PUBLIC_API_URL}/cnpj/${numberCnpj}`)
          const dadosIncricaoEstadual = await get(`${process.env.NEXT_PUBLIC_API_URL}/inscricaoestadual/${numberCnpj}`)
          setData({
            ...data,
            cnpj: dadosDaEmpresa.cnpj,
            nome_fantasia: dadosDaEmpresa.fantasia,
            razao_social: dadosDaEmpresa.nome,
            tipo_tributacao: dadosDaEmpresa.simei.optante === true ? 'mei' : dadosDaEmpresa.simples.optante === true ? 'simples_nacional' : 'mei',
            email: dadosDaEmpresa.email,
            unidade_empresa: dadosDaEmpresa.tipo,
            cep: dadosDaEmpresa.cep,
            endereco: dadosDaEmpresa.logradouro,
            numero: dadosDaEmpresa.numero,
            complemento: dadosDaEmpresa.complemento,
            bairro: dadosDaEmpresa.bairro,
            cidade: dadosDaEmpresa.municipio,
            uf: dadosDaEmpresa.uf
          })
          setBuscar(false)
          console.log(dadosDaEmpresa)
          console.log(dadosIncricaoEstadual)
        } catch (error) {
          console.error("Erro ao buscar os dados na receita", error)
        }
      }
    } else {
      setBuscar(true)
    }

  }

  return (
    <div className="container mx-auto">
      {/* Mensagem de resposta */}
      {responseMessage && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 text-gray-700">
          {responseMessage}
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">

        {/* CNPJ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">CNPJ</label>
          <InputMask type="text" name="cnpj" value={data.cnpj} onChange={buscaDadosCnpj} className="border border-gray-300 p-2 w-full" placeholder="00.000.000/0000-00" mask="99.999.999/9999-99" />
        </div>


        {/* Tipo de Tributação */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Tributação</label>
          <select name="tipo_tributacao" className="border border-gray-300 p-2 w-full" value={data.tipo_tributacao} onChange={handleChange}>
            <option value="mei">MEI</option>
            <option value="simples_nacional">Simples Nacional</option>
            <option value="simples_nacional_sublimite"> Simples Nacional Sublimite</option>
            <option value="lucro_normal">Lucro Normal</option>
          </select>
        </div>

        {/* Razão Social */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Razão Social</label>
          <input type="text" name="razao_social" value={data.razao_social} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Nome da empresa" />
        </div>

        {/* Outros campos... */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
          <input type="text" name="nome_fantasia" value={data.nome_fantasia} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Nome fantasia da empresa" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Unidade</label>
          <select name="unidade_empresa" className="border border-gray-300 p-2 w-full" value={data.unidade_empresa} onChange={handleChange}>
            <option value="matris">Matriz</option>
            <option value="filial">Filial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Incrição Estadual</label>
          <input type="text" name="ie" value={data.ie} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="" />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail</label>
          <input type="email" name="email" value={data.email} onChange={handleChange} className="border border-gray-300 p-2 w-full" placeholder="Email da empresa" />
        </div>

        {/* Botão para enviar o formulário */}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >
          Atualizar Empresa
        </button>
      </form>
    </div>
  );
};
