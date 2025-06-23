export const ButtonNew = ({ children, ...props }) => {
    return (<>
        <button {...props} className="bg-gray-300 rounded-lg h-11 px-4 py-3 md:py-1 hover:bg-gray-400 cursor-pointer text-gray-700 font-bold">{children}</button>
    </>)
}