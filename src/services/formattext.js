export const formatacnpj = async (cnpj) => {

    const cleanedCNPJ = await cnpj.replace(/\D/g, '');

    const formattedCNPJ = cleanedCNPJ.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        '$1.$2.$3/$4-$5'
    );

    return formattedCNPJ;
}