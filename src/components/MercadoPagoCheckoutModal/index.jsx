import { BsX } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { postMercadoPago } from '../../services/api';
import { FaLock, FaCheckCircle } from 'react-icons/fa';

export const MercadoPagoCheckoutModal = (props) => {
    const [paymentURL, setPaymentURL] = useState();
    const [nomePlano, setNomePlano] = useState("");
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(false);

    const closeModal = () => {
        if (props.hiddenCheckoutModal === "") {
            props.setHiddenCheckoutModal("hidden");
        }
    }

    useEffect(() => {
        if (props.planoSelecionado) {
            let emailUser = localStorage.getItem("applojaweb_user_email");
            console.log(emailUser)
            setNomePlano(props.planoSelecionado.plano_nome);
            const paymentData = {
                title: props.planoSelecionado.plano_nome,
                price: props.planoSelecionado.plano_valor,
                quantity: 1,
                external_reference: `${props.planoSelecionado.plano_id} ${props.planoSelecionado.plano_nome} ${props.planoSelecionado.plano_valor} ${emailUser}`
            };

            setLoading(true);
            Promise.all([
                postMercadoPago(process.env.NEXT_PUBLIC_API_URL + '/pagamentomercadopago', paymentData)
            ]).then(([cardPaymentRes]) => {
                setPaymentURL(cardPaymentRes.url);
                setProduto(paymentData);
                setLoading(false);
            }).catch((error) => {
                console.error('Houve um erro ao criar o pagamento:', error);
                setLoading(false);
            });
        }
    }, [props.planoSelecionado]);

    const pontoPorVirgula = (valor) => {
        let valorString;
        valorString = valor?.toString().replace(".", ",");
        return valorString;
    }

    const renderPaymentButtons = () => {
        if (!loading) {
            return (
                <div className='w-full flex flex-col gap-4'>
                    <a href={paymentURL} className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        <FaCheckCircle className="inline-block mr-2" /> Realizar pagamento
                    </a>
                </div>
            );
        } else {
            return (
                <a className="block w-full text-center bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                    <FaLock className="inline-block mr-2" /> Carregando...
                </a>
            );
        }
    };

    return (
        <div id="checkout-modal" className={props.hiddenCheckoutModal + " fixed z-50 inset-0 flex justify-center items-center bg-black bg-opacity-50"}>
            <div className="bg-applojaDark2 w-full max-w-md mx-auto rounded-lg overflow-hidden">
                {/* Modal header */}
                <div className="flex justify-between items-center p-4 bg-applojaDark text-white">
                    <h3 onClick={() => {console.log("Mercado pago: ",paymentURL);}} className="text-xl font-medium">
                        Checkout
                    </h3>
                    <button onClick={closeModal} type="button" className="text-gray-400 rounded-lg p-2 hover:bg-gray-500">
                        <BsX size={24} />
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                {/* Modal body */}
                <div className="flex flex-col justify-center items-center p-4">
                    {produto && (
                        <div className="mb-8 mt-4">
                            <h4 className="text-2xl font-medium text-white">{produto.title}</h4>
                            <p className="text-white text-xl">Preço: R${pontoPorVirgula(produto.price)}</p>
                        </div>
                    )}
                    {renderPaymentButtons()}
                </div>
                {/* Modal footer */}
                <div className="p-4 bg-applojaDark flex justify-center items-center">
                    <img src="/images/mercado-pago-logo.png" alt="Mercado Pago" className="h-14 mr-2" />
                    <span className="text-white text-sm">Pagamento seguro com Mercado Pago</span>
                </div>
            </div>
        </div>
    );
}
