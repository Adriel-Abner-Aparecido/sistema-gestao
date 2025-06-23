export const TableHead = ({ children, ...props }) => {
    return (<>
        <thead className="text-xs uppercase bg-gray-300" {...props}>
            {children}
        </thead>
    </>)

}