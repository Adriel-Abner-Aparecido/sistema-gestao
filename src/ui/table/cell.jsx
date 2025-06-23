export const TableCell = ({ children, className, ...props }) => {
    return (<>
        <td className={`py-4 px-6 ${className}`} {...props}>
            {children}
        </td>
    </>)
}