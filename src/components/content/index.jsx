import { useEffect, useState } from "react"
import { Drawer } from "../Drawer"
import { Header } from "../Header"
import { isMobile } from 'react-device-detect';
import { Alerts } from "../AlertComponent";
import { NotificacaoPagamentoComponent } from "../NotificacaoPagamentoComponent";
import { PromocaoComponent } from "../PromocaoComponent";
import { useEmpresa } from "../../context/empresaContext";
import { OfflineComponent } from "../offlineComponent";

export const Content = ({ children }) => {
    const [hiddenDrawer, setHiddenDrawer] = useState('hidden');
    const [mobile, setMobile] = useState();
    const [isOnline, setIsOnline] = useState(typeof window !== "undefined" ? navigator.onLine : true);

    const { empresa, setEmpresa, alerts, setAlerts, text, setText } = useEmpresa();

    useEffect(() => {
        function updateOnlineStatus() {
            setIsOnline(navigator.onLine);
        }

        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);

        return () => {
            window.removeEventListener("online", updateOnlineStatus);
            window.removeEventListener("offline", updateOnlineStatus);
        };
    }, []);

    useEffect(() => {
        if (isMobile) {
            setHiddenDrawer('hidden');
        } else {
            setHiddenDrawer('absolute lg:relative');
        }
    }, [mobile]);

    useEffect(() => {
        if (empresa?.planoId !== 1 && empresa?.inativo && empresa?.dias_para_expirar <= 18) {
            setAlerts(true);
            setText(
                `Seu plano vence em ${empresa.dias_para_expirar} Dias. Renove seu plano para continuar usando nossos serviços!`
            );
        }
    }, [empresa]);

    if (!isOnline) {
        return <OfflineComponent />;
    }

    return (<>
        <Header hiddenDrawer={hiddenDrawer} setHiddenDrawer={setHiddenDrawer} empresa={setEmpresa} />
        <div className="relative flex min-h-full">
            <Drawer hiddenDrawer={hiddenDrawer} sairPdv={true} />
            <div className="relative flex flex-col items-center w-full h-[calc(100vh-68px)] overflow-y-auto">
                <PromocaoComponent />
                <Alerts text={text} nivel={"critico"} alerts={alerts} />
                { /*<NotificacaoPagamentoComponent />*/}
                {children}
            </div>
        </div>
    </>);
};
