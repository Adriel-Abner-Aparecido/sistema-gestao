export const Table = ({ children, ...props }) => {
    return (<>
        <table className="w-full text-sm text-left text-gray-700" {...props}>
            {children}
        </table>
    </>)
}