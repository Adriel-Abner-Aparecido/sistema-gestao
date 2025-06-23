import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import styles from "../../styles/LabelGenerator.module.css";
import { useEmpresa } from "../../context/empresaContext";

export const EtiquetasSelecionadasComponent = () => {

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [labelStyles, setLabelStyles] = useState({});
    const labelRef = useRef([]);
    const [printOption, setPrintOption] = useState("barcode"); // Valor padrão

    const { empresa } = useEmpresa()

    useEffect(() => {
        const savedSettings = JSON.parse(localStorage.getItem("labelStyles"));
        const storedProducts = localStorage.getItem("selectedProducts");
        const storedStyles = localStorage.getItem("labelStyles");

        if (savedSettings.printOption) {
            setPrintOption(savedSettings.printOption);
        }

        if (storedProducts) {
            setSelectedProducts(JSON.parse(storedProducts));
        }

        if (storedStyles) {
            const parsedStyles = JSON.parse(storedStyles);
            setLabelStyles({
                ...parsedStyles,
                margin: `${parseFloat(parsedStyles.margin)}mm`,
                gap: `${parseFloat(parsedStyles.gap)}mm`,
                width: `${parseFloat(parsedStyles.width)}mm`,
                height: `${parseFloat(parsedStyles.height)}mm`,
            });
        }
    }, []);

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

    const handlePrint = () => {
        window.print();
    };

    console.log(printOption)

    return (
        <div className="container mx-auto px-4 py-8 print:py-0 print:px-0 print:mx-0">
            {selectedProducts.length === 0 ? (
                <p>Nenhum produto selecionado para exibir.</p>
            ) : (
                <div
                    className={styles.labelsPage}
                    style={{
                        ...labelStyles,
                        border: "none",
                    }}
                >
                    {selectedProducts.map((product, index) => (
                        <div
                            key={index}
                            className={styles.label}
                            style={{
                                width: labelStyles.width,
                                height: labelStyles.height,
                                overflow: "hidden",
                                position: "relative",
                                border: "none",
                            }}
                        >
                            {/* Nome do Produto */}
                            <h3 className="text-center text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                                {product.nome}
                            </h3>

                            {/* Canvas do Código de Barras */}
                            <canvas
                                ref={(el) => (labelRef.current[index] = el)}
                                style={{ display: "block", margin: "0 auto" }}
                            ></canvas>


                            {/* Divulgação da Apploja, condicional para o plano */}
                            {empresa?.planoId === 1 && (
                                <p className="text-center text-sm text-gray-500">
                                    Programa APPLoja
                                </p>
                            )}

                            {/* Renderização Condicional de Código com Base nas Configurações */}
                            {printOption === "barcode" && (
                                <p className="text-center text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                    {/* {product.codigo_barras} */}
                                </p>
                            )}

                            {printOption === "productCode" && (
                                <p className="text-center text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                    {/* {product.codigo_produto} */}
                                </p>
                            )}

                            {/* Preço */}
                            <h1 className="text-center font-bold text-lg">
                                R$ {product.valor?.toFixed(2).replace(".", ",")}
                            </h1>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}