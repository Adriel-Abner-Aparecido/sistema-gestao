export const convertDate = (date) => {
    const diaDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    const newDate = new Date(date)
    const semDay = diaDaSemana[newDate.getDay()]
    const day = String(newDate.getDate()).padStart(2, '0')
    const month = String(newDate.getMonth() + 1).padStart(2, '0')
    const year = newDate.getFullYear()
    const hour = String(newDate.getHours()).padStart(2, '0')
    const min = String(newDate.getMinutes()).padStart(2, '0')

    return `${semDay} - ${day}/${month}/${year} - ${hour}:${min}`
}

const date = new Date();
export const year = date.getFullYear();
export const month = String(date.getMonth() + 1).padStart(2, '0');
export const day = String(date.getDay()).padStart(2, '0');

export const utcStringToDateLocal = (utcString) => {
    var date = new Date(utcString);
    return date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

export const Hora = (time) => {
    const date = new Date(time)
    const hour = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')

    return `${hour}:${min}`
}

export const toDateTime = (time) => {
    const date = new Date(time)
    const Y = date.getFullYear()
    const M = String(date.getMonth() + 1).padStart(2, '0')
    const D = String(date.getDate()).padStart(2, '0')
    const H = String(date.getHours()).padStart(2, '0')
    const m = String(date.getMinutes()).padStart(2, '0')

    return `${Y}-${M}-${D} ${H}:${m}`
}

export function getPrimeiroDiaDoMesAtual() {
    let data = new Date();
    let ano = data.getFullYear();
    let mes = data.getMonth() + 1;

    let primeiroDia = new Date(ano, mes - 1, 1);

    let dia = primeiroDia.getDate();
    dia = dia < 10 ? '0' + dia : dia;  // Adiciona um zero à frente se o dia tiver um único dígito

    mes = mes < 10 ? '0' + mes : mes;  // Adiciona um zero à frente se o mês tiver um único dígito

    return `${ano}-${mes}-${dia}`;
}

export function getUltimoDiaDoMesAtual() {
    let data = new Date();
    let ano = data.getFullYear();
    let mes = data.getMonth() + 1;
    let ultimoDia = new Date(ano, mes, 0);

    let dia = ultimoDia.getDate();
    dia = dia < 10 ? '0' + dia : dia;  // Adiciona um zero à frente se o dia tiver um único dígito

    mes = mes < 10 ? '0' + mes : mes;  // Adiciona um zero à frente se o mês tiver um único dígito

    return `${ano}-${mes}-${dia}`;
}