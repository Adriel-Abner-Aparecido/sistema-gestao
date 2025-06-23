export const TableRow = ({ children, ...props }) => {
    return (<>
        <tr className="border-b bg-gray-100 hover:bg-gray-200" {...props}>
            {children}
        </tr>
    </>)
}