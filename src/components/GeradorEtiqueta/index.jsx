import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import JsBarcode from "jsbarcode";
import { get } from "../../services/api";
import Router from "next/router";
import { LoadingComponent } from "../LoadingComponent";
import { LabelSettingsModal } from "../LabelSettingsModal";
import styles from "../../styles/LabelGenerator.module.css";

export const LabelGenerator = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [labelsPerPage, setLabelsPerPage] = useState(30);
  const [margin, setMargin] = useState(10);
  const [spacing, setSpacing] = useState(5);
  const [columns, setColumns] = useState(3);
  const [labelWidth, setLabelWidth] = useState(100);
  const [labelHeight, setLabelHeight] = useState(50);
  const [printOption, setPrintOption] = useState("barcode"); // Estado para controlar a opção de impressão
  const labelRef = useRef([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem("selectedProducts");
    const savedStyles = JSON.parse(localStorage.getItem("labelStyles"));

    if (savedProducts) {
      setSelectedProducts(JSON.parse(savedProducts));
    }

    if (savedStyles) {
      if (savedStyles.margin) setMargin(parseInt(savedStyles.margin));
      if (savedStyles.gap) setSpacing(parseInt(savedStyles.gap));
      if (savedStyles.gridTemplateColumns) {
        setColumns(parseInt(savedStyles.gridTemplateColumns.match(/\d+/)[0]));
      }
      if (savedStyles.width) setLabelWidth(parseInt(savedStyles.width));
      if (savedStyles.height) setLabelHeight(parseInt(savedStyles.height));
      setPrintOption(savedStyles.printOption || "barcode"); // Carrega printOption do localStorage
    }


    setLoading(false);
  }, []);

  const saveSettings = () => {
    const labelStyles = {
      margin: `${margin}mm`,
      gap: `${spacing}mm`,
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      width: `${labelWidth}mm`,
      height: `${labelHeight}mm`,
      printOption, // Salva a opção de impressão
    };
    localStorage.setItem("labelStyles", JSON.stringify(labelStyles));
  };


  useEffect(() => {
    selectedProducts.map((product, index) => {
      const canvas = labelRef.current[index];
      const ctx = canvas.getContext("2d");

      // Limpa o canvas antes de desenhar
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Verifica se a opção é "barcode" (gerar código de barras)
      const codigoProduto = printOption === "barcode" ? product.codigo_barras ? product.codigo_barras : product.codigo_produto : product.codigo_produto;

      // Verifica se o código do produto é válido
      if (codigoProduto) {
        // Usa CODE128C se o código for apenas números pares, senão usa CODE128
        const formato = /^[0-9]+$/.test(codigoProduto) && codigoProduto.length % 2 === 0
          ? "CODE128C"
          : "CODE128";

        // Gera o código de barras
        JsBarcode(canvas, codigoProduto, {
          format: formato,
          displayValue: true, // Exibe o valor abaixo do código de barras
          width: 1.5,
          height: 40,
          fontSize: 12, // Tamanho do texto abaixo
          lineColor: "#000", // Cor das barras
        });
      } else {
        console.error(`Produto sem código válido: ${product.nome}`);
      }

    });
  }, [selectedProducts, printOption]);

  const verEtiquetasSelecionadas = () => {
    const labelStyles = {
      margin: `${margin}px`,
      gap: `${spacing}px`,
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      width: `${labelWidth}px`,
      height: `${labelHeight}px`,
      displayValue: true,
      printOption: printOption
    };

    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
    localStorage.setItem("labelStyles", JSON.stringify(labelStyles));
    window.open("/etiquetas-selecionadas");
  };

  const buscarProduto = async () => {
    setLoading(true);
    const pesquisaProduto = document.getElementById("produto").value;

    if (pesquisaProduto === "") {
      setProducts([]);
      setLoading(false) // Limpa a lista de produtos se o campo estiver vazio
    } else {
      try {
        const dataEstoque = await get(`${process.env.NEXT_PUBLIC_API_URL}/estoquenomecodigo/${pesquisaProduto}`);
        if (dataEstoque.mensagem === "falha na autenticação") {
          console.log("Falha na autenticação");
          localStorage.removeItem("applojaweb_token");
          Router.push("/login");
        } else {
          setProducts(dataEstoque || []); // Use dataEstoque diretamente
        }
      } catch (error) {
        console.error("Erro ao buscar produto", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const adicionarProduto = (product, quantidade) => {
    const itemsToAdd = Array(quantidade).fill({ ...product });
    setSelectedProducts((prevProducts) => [...prevProducts, ...itemsToAdd]);
  };

  console.log(printOption)

  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>

          <div className="flex space-x-4">
            <button onClick={() => setIsProductModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              Adicionar Produtos
            </button>

            <button onClick={() => setIsSettingsModalOpen(true)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
              Configurações das Etiquetas
            </button>

            <button onClick={verEtiquetasSelecionadas} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
              Imprimir
            </button>

          </div>


          {/* Modal de Pesquisa de Produtos */}
          {
            isProductModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
                style={{ zIndex: 50 }} // Z-index mais alto para o modal
              >
                <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-[500px] overflow-y-scroll relative">
                  <h2 className="text-xl font-bold mb-4">Buscar Produtos</h2>

                  {/* Botão Fechar fixo no topo direito */}
                  <button onClick={() => setIsProductModalOpen(false)} className="bg-red-500 text-white p-2 rounded absolute top-4 right-4" style={{ zIndex: 60 }} >
                    Fechar
                  </button>

                  <input type="text" id="produto" placeholder="Nome ou Código do Produto" onKeyDown={(e) => e.key === 'Enter' && buscarProduto()} className="border p-2 mb-4 rounded w-full" autoComplete="off" />
                  <button onClick={buscarProduto} className="bg-blue-500 text-white p-2 rounded mb-4">
                    Buscar
                  </button>
                  <ul>
                    {
                      products.map((product, index) => (
                        <li key={index} className="flex justify-between items-center border p-2 mb-2 rounded">
                          <span>{product.nome} {product.valor ? `- R$ ${product.valor?.toFixed(2).replace(".", ",")}` : '0,00'}</span>
                          <input type="number" id={`quantidadeSelecionada-${index}`} min="1" defaultValue={product.quantidade > 0 ? product.quantidade : 1} className="border p-1 mx-2 rounded w-16 text-center" onChange={(e) => { product.quantidadeSelecionada = Math.max(parseInt(e.target.value, 10) || 1, 1); }} />
                          <button onClick={() => adicionarProduto(product, product.quantidadeSelecionada || 1)} className="bg-green-500 text-white p-1 rounded" >
                            Incluir
                          </button>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            )
          }

          {/* Modal de Configurações */}
          <LabelSettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            margin={margin}
            setMargin={setMargin}
            spacing={spacing}
            setSpacing={setSpacing}
            columns={columns}
            setColumns={setColumns}
            labelWidth={labelWidth}
            setLabelWidth={setLabelWidth}
            labelHeight={labelHeight}
            setLabelHeight={setLabelHeight}
            setPrintoption={setPrintOption}
            onSave={saveSettings}
          />

          <div className="selected-products my-4">
            <h2 className="text-xl font-semibold text-gray-700 mt-6">Produtos Selecionados para Impressão de Etiquetas</h2>

            <div className="flex justify-between items-center">
              {
                selectedProducts.length === 0 ? (
                  <p>Nenhum produto selecionado.</p>
                ) : (
                  <button onClick={() => { setSelectedProducts([]); localStorage.removeItem("selectedProducts"); }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mb-4" >
                    Remover Todos
                  </button>
                )
              }
            </div>
            {
              selectedProducts.length > 0 && (
                <div className={styles.labelsPage} style={{ margin: `${margin}mm`, gap: `${spacing}mm`, gridTemplateColumns: `repeat(${columns}, 1fr)`, zIndex: 1, }} >
                  {selectedProducts.slice(0, labelsPerPage).map((product, index) => (
                    <div key={index} className={styles.label} style={{ width: `${labelWidth}mm`, height: `${labelHeight}mm`, border: "1px solid #ddd", position: "relative", padding: "8px", overflow: "hidden", }} >
                      <button onClick={() => { setSelectedProducts((prev) => prev.filter((_, i) => i !== index)); }} className="absolute top-1 right-1 text-red-500 font-bold" style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "16px", }} >
                        ✕
                      </button>
                      <h3 className="text-sm font-medium mb-2">{product.nome}</h3>


                      <canvas ref={
                        (el) => (labelRef.current[index] = el)}
                        width={labelWidth}
                        height={labelHeight}
                        style={{ display: "block", margin: "0 auto" }}
                      />


                      {/* Renderização Condicional de Código com Base nas Configurações */}
                      {
                        printOption === "barcode" ? (
                          <p className="text-center text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                            {/* {product.codigo_barras} */}
                          </p>
                        ) : null
                      }

                      {
                        printOption === "productCode" ? (
                          <p className="text-center text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                            {/* {product.codigo_produto} */}
                          </p>
                        ) : null
                      }

                      <h1 className="text-center font-bold text-lg">R$ {product.valor?.toFixed(2).replace(".", ",")}</h1>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </>
      )}
    </div>
  );
};

export default LabelGenerator;
