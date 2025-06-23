export const formasPagamento = (pagamento) => {
    switch (pagamento) {
        case "01":
            return `${pagamento} - Dinheiro`
        case "02":
            return `${pagamento} - Cheque`
        case "03":
            return `${pagamento} - Cartão de Crédito`
        case "04":
            return `${pagamento} - Cartão de Débito`
        case "05":
            return `${pagamento} - Crédito loja`
        case "10":
            return `${pagamento} - Vale Alimentação`
        case "11":
            return `${pagamento} - Vale Refeição`
        case "12":
            return `${pagamento} - Vale Presente`
        case "13":
            return `${pagamento} - Vale Combustivel`
        case "14":
            return `${pagamento} - Duplicata Mercantil`
        case "15":
            return `${pagamento} - Boleto Bancario`
        case "16":
            return `${pagamento} - Depósito Bancário`
        case "17":
            return `${pagamento} - Pagamento Instantâneo (PIX)`
        case "18":
            return `${pagamento} - Transferência bancária, Carteira Digital`
        case "19":
            return `${pagamento} - Programa de fidelidade, Cashback, Crédito Virtual`
        case "90":
            return `${pagamento} - Sem pagamento`
        case "99":
            return `${pagamento} - Outros`
        default:
            return ``
    }
}