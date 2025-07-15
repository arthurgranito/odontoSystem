export default function converteDataParaBR(dataISO: Date): string {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.toString().split("-");
    if (ano && mes && dia) {
        return `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}/${ano}`;
    }
    return "";
}