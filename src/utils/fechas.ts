export const formatDateToMySQLFormat = (dateString: string) => {
  // Asumiendo que dateString está en formato 'YYYY-MM-DDTHH:mm:ss.sssZ'
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return `${year}-${month}-${day}`;
};

export const formatDateToMySQLFormatWithTime = (dateString: string) => {
  // Asumiendo que dateString está en formato 'YYYY-MM-DDTHH:mm:ss.sssZ'
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getDateWithName = () => {
  const fecha = new Date();

  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const anio = fecha.getFullYear();
  const hora = fecha.getHours();
  const minuto = fecha.getMinutes();

  const nombreMes = obtenerNombreMes(mes);
  const minutoFormateado = minuto < 10 ? `0${minuto}` : minuto;

  const fechaActual = `${dia} de ${nombreMes} de ${anio} ${hora}:${minutoFormateado}`;

  return fechaActual;
};

const obtenerNombreMes = (numeroMes: number): string => {
  const nombresMeses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // Restamos 1 al número de mes porque los índices de los arrays comienzan en 0
  const indiceMes = numeroMes - 1;

  // Verificar si el índice de mes es válido
  if (indiceMes >= 0 && indiceMes < nombresMeses.length) {
    return nombresMeses[indiceMes];
  }

  return "";
};
