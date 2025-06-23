import React, { useState } from "react";

export const LabelSettingsModal = ({
  isOpen,
  onClose,
  margin,
  setMargin,
  spacing,
  setSpacing,
  columns,
  setColumns,
  labelWidth,
  setLabelWidth,
  labelHeight,
  setLabelHeight,
  setPrintoption,
  onSave
}) => {
  // Inicializa o estado com o valor do localStorage, caso exista, ou com "barcode" como padrão.
  const [printOption, setPrintOption] = useState(() => {
    const savedSettings = JSON.parse(localStorage.getItem("labelStyles"));
    return savedSettings?.printOption || "barcode";
  });

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    setPrintoption(() => printOption)
    const labelStyles = {
      printOption,
    };

    // Salva no localStorage
    localStorage.setItem("labelStyles", JSON.stringify(labelStyles));

    onClose(); // Fecha o modal após salvar as configurações
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative z-50">
        <h2 className="text-xl font-bold mb-4">Configurações das Etiquetas</h2>

        {/* Campo de Margem */}
        <label className="block mb-2">
          Margem (mm):
          <input type="number" value={margin} onChange={(e) => setMargin(parseInt(e.target.value))} className="border p-1 rounded w-full" />
        </label>

        {/* Campo de Espaçamento */}
        <label className="block mb-2">
          Espaçamento (mm):
          <input type="number" value={spacing} onChange={(e) => setSpacing(parseInt(e.target.value))} className="border p-1 rounded w-full" />
        </label>

        {/* Campo de Colunas */}
        <label className="block mb-2">
          Colunas:
          <input type="number" value={columns} onChange={(e) => setColumns(parseInt(e.target.value))} className="border p-1 rounded w-full" />
        </label>

        {/* Campo de Largura da Etiqueta */}
        <label className="block mb-2">
          Largura da Etiqueta (mm):
          <input type="number" value={labelWidth} onChange={(e) => setLabelWidth(parseInt(e.target.value))} className="border p-1 rounded w-full" />
        </label>

        {/* Campo de Altura da Etiqueta */}
        <label className="block mb-2">
          Altura da Etiqueta (mm):
          <input type="number" value={labelHeight} onChange={(e) => setLabelHeight(parseInt(e.target.value))} className="border p-1 rounded w-full" />
        </label>

        {/* Opções de Código Imprimir */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Código Imprimir</h3>
          <select value={printOption} onChange={(e) => setPrintOption(e.target.value)} className="border p-2 rounded w-full" >
            <option value="barcode">Código de Barras</option>
            <option value="productCode">Código do Produto</option>
          </select>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <button onClick={handleSaveSettings} className="bg-blue-500 text-white p-2 rounded mt-4 mb-4" >
            Salvar Configurações
          </button>
          <button onClick={onClose} className="bg-red-500 text-white p-2 rounded mt-4 mb-4">Fechar</button>
        </div>
      </div>
    </div>
  );
};
