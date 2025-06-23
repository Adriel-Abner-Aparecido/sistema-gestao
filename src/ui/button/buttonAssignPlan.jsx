export const ButtonAssignPlan = ({ ...props }) => {
    return (<>
        <button type="button" className={`font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none`} {...props}>
            Assinar plano
        </button>
    </>)
}