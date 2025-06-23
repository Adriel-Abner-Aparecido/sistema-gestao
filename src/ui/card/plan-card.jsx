export const PlanCard = ({ children }) => {
    return (<>
        <div className="w-full max-w-sm p-4 rounded-lg shadow sm:p-8 bg-white border border-blue-500 transition duration-300 ease-in-out hover:scale-105">
            {children}
        </div>
    </>)
}