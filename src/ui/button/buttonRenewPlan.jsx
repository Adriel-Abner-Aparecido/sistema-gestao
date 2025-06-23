export const ButtonRenewPlan = ({ ...props }) => {
    return (<>
        <button type="button" className={`font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none`} {...props}>
            Renovar Plano
        </button>
    </>)
}