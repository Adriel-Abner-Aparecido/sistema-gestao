import { BsWifiOff } from "react-icons/bs"

export const OfflineComponent = () => {
    return (<>
        <div className="flex flex-col w-full h-screen text-center items-center justify-center">
            <BsWifiOff size={45} />
            <h1 className="font-bold">Offline</h1>
        </div>
    </>)
}