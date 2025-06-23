
import { useState } from 'react';
import { ConfigFiscal } from "../ConfigFiscalComponente";

export const ConfigNavigationPanel = () => {
  const [isOpen, setIsOpen] = useState({
    gerais: false,
    cadastros: false,
    financeiro: false,
    estoque: false,
    vendas: false,
    compras: false,
    servicos: false,
    transportes: false,
  });

  const toggleMenu = (menu) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <>
      {/* Menu Lateral */}
      <div className="flex flex-row w-full justify-center p-5">
        {/* <div className="w-1/4 bg-gray-50 rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-bold mb-4">Menu</h2>
          <ul>            
            <li>
              <button
                onClick={() => toggleMenu('notafiscal')}
                className="w-full text-left py-2"
              >
                Notas Fiscais
              </button>
              {isOpen.notafiscal && (
                <ul className="ml-4">
                  <li>Configurações</li>
                </ul>
              )}
            </li>
          </ul>
        </div> */}

        {/* Conteúdo da Configuração */}
        <div className="w-3/4 bg-white p-6 rounded-lg shadow-md">
          {/* Aqui vai o conteúdo que vai ser alterado de acordo com a seleção do menu */}
          <h2 className="text-lg font-bold mb-4">Dados Fiscais</h2>
          <ConfigFiscal />
        </div>
      </div>
    </>
  );
};
