import React, { useState } from 'react';
import { UploadCertificado } from "../UploadCertificado";
import { FormEmpresaWebmania } from "../CadastroFiscaisEmpresa";
import { FormEnderecoEmpresa } from "../EnderecoFiscalComponent";
import { FormNfeEmpresa } from "../ConfigNFEComponent";
import { FormNfceEmpresa } from "../ConfigNFCEComponent";
import { BsAwardFill, BsBriefcaseFill, BsFileEarmarkTextFill, BsGeoAltFill, BsShieldLockFill, BsTrashFill } from 'react-icons/bs';
import { post } from '../../services/api';
import { ZerarDadosComponent } from '../serarDadosComponent';

export const ConfigFiscal = () => {

  const dadosDaEmpresaPadrao = {
    tipo_tributacao: '',
    cnpj: '',
    razao_social: '',
    nome_fantasia: '',
    ie: '',
    unidade_empresa: '',
    email: '',
    telefone: '',
    contabilidade: '',
    logomarca: '',
    regime_tributario: '',
    cpf: '', // Para pessoa física
    nome_completo: '', // Para pessoa física
    im: '', // Inscrição Municipal
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
  }

  // Estado para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState('dadosEmpresa'); // "dadosEmpresa" é a aba padrão
  const [dadosDaEmpresa, setDadosDaEmpresa] = useState(dadosDaEmpresaPadrao)
  const [responseMessage, setResponseMessage] = useState('')

  // Função para alternar entre as abas
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmitDadosEmpresa = async (e) => {

    const empresaData = {
      tipo_tributacao: dadosDaEmpresa.tipo_tributacao,
      cnpj: dadosDaEmpresa.cnpj,
      razao_social: dadosDaEmpresa.razao_social,
      nome_fantasia: dadosDaEmpresa.nome_fantasia,
      ie: dadosDaEmpresa.ie,
      unidade_empresa: dadosDaEmpresa.unidade_empresa,
      email: dadosDaEmpresa.email,
      telefone: dadosDaEmpresa.telefone,
      logomarca: dadosDaEmpresa.logomarca,
      regime_tributario: dadosDaEmpresa.regime_tributario,
      cpf: dadosDaEmpresa.cpf || null, // Para pessoa fisica
      nome_completo: dadosDaEmpresa.nome_completo || null, // Para pessoa física
      im: dadosDaEmpresa.im,
    }

    e.preventDefault();
    try {
      const response = await post(`${process.env.NEXT_PUBLIC_API_URL}/atualizar-empresa-webmania`, empresaData);
      if (response.message === 'Empresa atualizada com sucesso') {
        console.log("Sucesso")
      }
      setResponseMessage(response.data.message || 'Empresa atualizada com sucesso');
    } catch (error) {
      setResponseMessage('Erro ao atualizar a empresa. Por favor, tente novamente.');
      console.error(error);
    }
  };

  const handleSubmitEnderecoDaEmpresa = async (e) => {

    const enderecoEmpresa = {
      cep: dadosDaEmpresa.cep,
      endereco: dadosDaEmpresa.endereco,
      numero: dadosDaEmpresa.numero,
      complemento: dadosDaEmpresa.complemento || "",
      bairro: dadosDaEmpresa.bairro,
      cidade: dadosDaEmpresa.cidade,
      uf: dadosDaEmpresa.uf
    }

    e.preventDefault();

    try {
      const response = await post(`${process.env.NEXT_PUBLIC_API_URL}/atualizar-endereco-empresa`, enderecoEmpresa);
      setResponseMessage(response.data.message || 'Endereço atualizado com sucesso');
    } catch (error) {
      setResponseMessage('Erro ao atualizar o endereço. Por favor, tente novamente.');
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-full px-5">
        {/* Tabs Header */}
        <div className="flex border-b border-gray-200 gap-2">
          {/* Dados da Empresa */}
          <button type="button" onClick={() => handleTabChange('dadosEmpresa')} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'dadosEmpresa' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} >
            <span className='flex flex-row gap-2 items-center'><BsBriefcaseFill /> Dados da Empresa</span>
          </button>

          {/* Endereço Fiscal */}
          <button type="button" onClick={() => handleTabChange('enderecoFiscal')} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'enderecoFiscal' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} >
            <span className='flex flex-row gap-2 items-center'><BsGeoAltFill />Endereço Fiscal</span>
          </button>

          {/* NFe */}
          <button type="button" onClick={() => handleTabChange('nfe')} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'nfe' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} >
            <span className='flex flex-row gap-2 items-center'><BsFileEarmarkTextFill />NFe</span>
          </button>

          {/* NFC-e */}
          <button type="button" onClick={() => handleTabChange('nfce')} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'nfce' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} >
            <span className='flex flex-row gap-2 items-center'><BsFileEarmarkTextFill />NFC-e</span>
          </button>

          {/* Certificado */}
          <button type="button" onClick={() => handleTabChange('certificado')} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'certificado' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} >
            <span className='flex flex-row gap-2 items-center'><BsAwardFill />Certificado</span>
          </button>

          {/* Credenciais */}
          <button type="button" onClick={() => handleTabChange('credenciais')} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'credenciais' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} >
            <span className='flex flex-row gap-2 items-center'><BsShieldLockFill />Credenciais</span>
          </button>

          {/* Zerar dados */}
          <button type="button" onClick={() => handleTabChange('zerar-dados')} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'zerar-dados' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} >
            <span className='flex flex-row gap-2 items-center'><BsTrashFill />Zerar Dados</span>
          </button>
        </div>


        {/* Tabs Content */}
        <div className="mt-4">
          {/* Dados da Empresa */}
          <div className={activeTab === 'dadosEmpresa' ? '' : 'hidden'}>
            <FormEmpresaWebmania data={dadosDaEmpresa} setData={setDadosDaEmpresa} submit={(e) => handleSubmitDadosEmpresa(e)} responseMessage={responseMessage} />
          </div>

          {/* Endereço Fiscal */}
          <div className={activeTab === 'enderecoFiscal' ? '' : 'hidden'}>
            <FormEnderecoEmpresa data={dadosDaEmpresa} setData={setDadosDaEmpresa} submit={(e) => handleSubmitEnderecoDaEmpresa(e)} responseMessage={responseMessage} />
          </div>

          {/* NFe */}
          <div className={activeTab === 'nfe' ? '' : 'hidden'}>
            <FormNfeEmpresa />
          </div>

          {/* NFC-e */}
          <div className={activeTab === 'nfce' ? '' : 'hidden'}>
            <FormNfceEmpresa />
          </div>

          {/* Certificado */}
          <div className={activeTab === 'certificado' ? '' : 'hidden'}>
            <UploadCertificado />
          </div>

          {/* Certificado */}
          <div className={activeTab === 'zerar-dados' ? '' : 'hidden'}>
            <ZerarDadosComponent />
          </div>

          {/* Credenciais */}
          <div className={activeTab === 'credenciais' ? '' : 'hidden'}>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-black">Nota Fiscal Key</label>
                <input name="consumerKey" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
              </div>
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-black">Nota Fiscal Secret</label>
                <input name="consumerSecret" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
              </div>
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-black">Classe Imposto Padrão</label>
                <input name="classeImpostoPadrao" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

};
