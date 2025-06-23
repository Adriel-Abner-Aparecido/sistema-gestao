export const ButtonAtualPlan = ({ ...props }) => {
    return (<>
        <button type="button" className={`font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center text-blue-600 bg-white hover:bg-gray-100 border border-blue-600`} {...props} disabled>
            Seu Plano Atual
        </button>
    </>)
}