export const TableBody = ({ children, className, ...props }) => {
    return (<>
        <tbody className={className} {...props}>
            {children}
        </tbody>
    </>)
}