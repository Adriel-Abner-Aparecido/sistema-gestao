import { useEffect, useState } from "react";
import { get, getPublic } from "../../services/api";
import Router from "next/router";
import InputMask from 'react-input-mask';
import axios from 'axios';

export const EmpresaComponent = () => {

    const dadosEmpresaPadrao = {
        id: '',
        nome: '',
        nomeFantasia: '',
        cnpj: '',
        telefone: '',
        celular: '',
        email: '',
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        complemento: '',
        cidade: '',
        uf: '',
        planoId: '',
        consumerKey: '',
        consumerSecret: '',
        classeImpostoPadrao: '',
        logoImage: '',
        emailUser: null,
        origem: null
    }

    const [empresa, setEmpresa] = useState(dadosEmpresaPadrao);
    const [notaFiscal, setNotaFiscal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const loadAll = async () => {
        try {
            const res = await get(`${process.env.NEXT_PUBLIC_API_URL}/minhaempresa`)
            setEmpresa({
                id: res[0].id,
                nome: res[0].nome || '',
                nomeFantasia: res[0].nome_fantasia || '',
                cnpj: res[0].cnpj || '',
                telefone: res[0].telefone || '',
                celular: res[0].celular || '',
                email: res[0].email || '',
                cep: res[0].cep || '',
                rua: res[0].rua || '',
                numero: res[0].numero || '',
                bairro: res[0].bairro || '',
                complemento: res[0].complemento || '',
                cidade: res[0].cidade || '',
                uf: res[0].uf || '',
                planoId: res[0].plano_id || '',
                consumerKey: res[0].webmania_consumer_key || '',
                consumerSecret: res[0].webmania_consumer_secret || '',
                classeImpostoPadrao: res[0].classe_imposto_padrao || '',
                logoImage: res[0].logo_image ? res[0].logo_image : null,
                emailUser: null,
                origem: null
            });
            if (res[0].plano_id == 4) {
                setNotaFiscal(true);
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    const handleImageUpload = (event) => {

        const file = event.target.files[0];

        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);

            const reader = new FileReader();


            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };


            reader.onerror = () => {
                console.error("Error reading file");
                alert("Erro ao carregar a imagem, por favor tente novamente.");
            };

            reader.readAsDataURL(file);
        } else {
            alert("Por favor, selecione um arquivo de imagem válido.");
        }
    };

    const handleChange = (event) => {
        setEmpresa({ ...empresa, [event.target.name]: event.target.value })
    }

    const buscarCep = (cep) => {

        setEmpresa({ ...empresa, cep: cep })

        const cepRefatorado = cep.replace(/\D/g, "");

        if (process.env.CEP_TOKEN_APP_KEY != undefined && process.env.CEP_TOKEN_APP_SECRET != undefined) {
            if (cepRefatorado.length == 8) {
                getPublic(`https://webmaniabr.com/api/1/cep/${cepRefatorado}/?app_key=${process.env.CEP_TOKEN_APP_KEY}&app_secret=${process.env.CEP_TOKEN_APP_SECRET}`).then((res) => {
                    setEmpresa({
                        ...empresa,
                        cep: cep,
                        rua: res.endereco,
                        cidade: res.cidade,
                        bairro: res.bairro,
                        uf: res.uf
                    })
                });
            }
        }
    };

    const salvar = async (event) => {

        event.preventDefault()

        try {
            const formData = new FormData();
            if (selectedImage) {
                formData.append("logo_image", selectedImage);
            }

            const uploadResponse = await axios.post('https://apploja.com/upload/', formData);

            const updatedEmpresa = {
                id: empresa.id,
                nome: empresa.nome || '',
                nomeFantasia: empresa.nomeFantasia || '',
                cnpj: empresa.cnpj || '',
                telefone: empresa.telefone || '',
                celular: empresa.celular || '',
                email: empresa.email || '',
                cep: empresa.cep || '',
                rua: empresa.rua || '',
                numero: empresa.numero || '',
                bairro: empresa.bairro || '',
                complemento: empresa.complemento || '',
                cidade: empresa.cidade || '',
                uf: empresa.uf || '',
                planoId: empresa.planoId || '',
                consumerKey: empresa.consumerKey || '',
                consumerSecret: empresa.consumerSecret || '',
                classeImpostoPadrao: empresa.classeImpostoPadrao || '',
                logoImage: uploadResponse.logo_image ? uploadResponse.logo_image : null,
                emailUser: null,
                origem: null,
                logo_image: uploadResponse.data.link || null,
            };

            const atualiza = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/empresas/${empresa.id}`, updatedEmpresa);

            if (atualiza.data.affectedRows) {
                alert("Salvo com sucesso!");
                Router.reload('/empresa');
            } else {
                console.error("Erro ao salvar a empresa.");
            }
        } catch (error) {
            console.error("Ocorreu um erro ao salvar:", error);
            alert("Ocorreu um erro ao tentar salvar. Por favor, tente novamente.");
        }
    };

    return (
        <div className="flex flex-col w-full px-5">
            <div className="flex flex-col bg-gray-200 w-full h-full py-8 px-4 lg:px-10 mt-4 mb-4 rounded justify-between md:flex-col">
                <form onSubmit={salvar} id="formEmpresa" className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col gap-4 items-center w-full">
                        <div className="relative flex flex-col gap-2">
                            {
                                imagePreview ? (
                                    <img src={imagePreview} className="w-32 h-32" alt="Logo da Empresa" />
                                ) : empresa.logoImage ? (
                                    <img src={empresa.logoImage} className="w-32 h-32" alt="Logo da Empresa" />
                                ) : (
                                    <img src="/images/iconAvatar.png" className="w-32 h-32" alt="Avatar do Usuário" />
                                )
                            }
                            <label htmlFor="logoImage" className="block p-2 bg-blue-500 rounded-full text-white text-center cursor-pointer hover-bg-blue-600" >
                                Trocar Imagem
                            </label>
                            <input id="logoImage" type="file" className="hidden" onChange={handleImageUpload} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-black">Razão Social</label>
                            <input name='nome' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" defaultValue={empresa.nome} onChange={handleChange} required />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-black" htmlFor="nomeFantasia">Nome Fantasia</label>
                            <input name="nomeFantasia" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" defaultValue={empresa.nomeFantasia} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-black">CNPJ</label>
                            <InputMask name="cnpj" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" mask="99.999.999/9999-99" value={empresa.cnpj} onChange={handleChange} />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-black">E-mail</label>
                            <input name='email' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" defaultValue={empresa.email} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-black">Telefone</label>
                            <InputMask name="telefone" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" mask="(99) 9999-9999" value={empresa.telefone} onChange={handleChange} />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-black">Celular</label>
                            <InputMask name="celular" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" mask="(99) 9 9999-9999" value={empresa.celular} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4 w-full">
                        <div className="flex flex-col">
                            <label className="block mb-2 text-sm font-medium text-black" htmlFor="cep">CEP</label>
                            <InputMask className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" name="cep" value={empresa.cep} onChange={(e) => buscarCep(e.target.value)} mask={'99999-999'} />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-black" htmlFor="rua">Rua</label>
                            <input className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" name="rua" defaultValue={empresa.rua} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className="block mb-2 text-sm font-medium text-black" htmlFor="complemento">Complemento</label>
                            <input className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" name="complemento" defaultValue={empresa.complemento} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className="block mb-2 text-sm font-medium text-black" htmlFor="numero">N°</label>
                            <input className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" name="numero" defaultValue={empresa.numero} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-black" htmlFor="bairro">Bairro</label>
                            <input className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" name="bairro" defaultValue={empresa.bairro} onChange={handleChange} />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-black" htmlFor="cidade">Cidade</label>
                            <input className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" name="cidade" defaultValue={empresa.cidade} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className="block mb-2 text-sm font-medium text-black" htmlFor="uf">UF</label>
                            <input className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" name="uf" defaultValue={empresa.uf} onChange={handleChange} />
                        </div>
                    </div>
                    {
                        notaFiscal &&
                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            <div className="flex-1">
                                <label className="block mb-2 text-sm font-medium text-black">Nota Fiscal Key</label>
                                <input name='consumerKey' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" defaultValue={empresa.consumerKey} onChange={handleChange} />
                            </div>
                            <div className="flex-1">
                                <label className="block mb-2 text-sm font-medium text-black">Nota Fiscal Secret</label>
                                <input name='consumerSecret' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" defaultValue={empresa.consumerSecret} onChange={handleChange} />
                            </div>
                            <div className="flex-1">
                                <label className="block mb-2 text-sm font-medium text-black">Classe Imposto Padrão</label>
                                <input name='classeImpostoPadrao' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" defaultValue={empresa.classeImpostoPadrao} onChange={handleChange} />
                            </div>
                        </div>
                    }
                </form>
                <div className="mt-4 flex justify-end">
                    <button type="submit" form="formEmpresa" className="bg-green-500 hover:bg-green-700 w-full md:w-1/3 text-white font-bold py-2 px-4 rounded">Salvar</button>
                </div>
            </div>
        </div>
    )
}