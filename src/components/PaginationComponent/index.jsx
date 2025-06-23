import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight } from "react-icons/bs";

export const PaginationComponent = ({ totalPages, paginaAtual }) => {
    const [pageAtual, setPageAtual] = useState(1);
    const [mobile, setMobile] = useState(isMobile);

    useEffect(() => {
        paginaAtual(pageAtual); // Atualiza a página atual no componente pai
    }, [pageAtual]);

    useEffect(() => {
        setMobile(isMobile); // Detecta se é um dispositivo móvel
    }, [isMobile]);

    const nextPage = () => {
        setPageAtual((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const backPage = () => {
        setPageAtual((prevPage) => Math.max(prevPage - 1, 1));
    };

    const firstPage = () => {
        setPageAtual(1);
    };

    const lastPage = () => {
        setPageAtual(totalPages);
    };

    const pageSelect = (page) => {
        setPageAtual(page);
    };

    const contadorPaginas = () => {
        const numero = [];

        // Limitação do número de links exibidos
        const maxLinks = mobile ? 5 : 10; // 5 links para mobile, 10 para desktop
        let startPage = Math.max(pageAtual - Math.floor(maxLinks / 2), 1);
        let endPage = Math.min(startPage + maxLinks - 1, totalPages);

        // Ajusta o startPage quando as páginas finais estão próximas
        if (endPage - startPage < maxLinks - 1) {
            startPage = Math.max(endPage - maxLinks + 1, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            numero.push(
                <li key={i}>
                    <button onClick={() => pageSelect(i)} className={pageAtual === i ? "h-full px-3 py-2 border text-gray-700 bg-gray-100" : "h-full px-3 py-2 border text-gray-700"}>
                        {i}
                    </button>
                </li>
            );
        }

        return numero;
    };

    console.log("ismobile", isMobile)

    if (totalPages > 1) {
        return (
            <div className="flex justify-center mb-4">
                <nav>
                    <ul className="inline-flex -space-x-px">
                        <li>
                            <button onClick={firstPage} className="h-full px-3 py-2 ml-0 leading-tight rounded-l-lg border text-gray-700">
                                <BsChevronDoubleLeft size={20} />
                            </button>
                        </li>
                        <li>
                            <button onClick={backPage} className="h-full px-3 py-2 leading-tight border text-gray-700">
                                <BsChevronLeft size={20} />
                            </button>
                        </li>
                        {contadorPaginas()}
                        <li>
                            <button onClick={nextPage} className="h-full px-3 py-2 leading-tight border text-gray-700">
                                <BsChevronRight size={20} />
                            </button>
                        </li>
                        <li>
                            <button onClick={lastPage} className="h-full px-3 py-2 leading-tight border rounded-r-lg text-gray-700">
                                <BsChevronDoubleRight size={20} />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }

    return null;
};
