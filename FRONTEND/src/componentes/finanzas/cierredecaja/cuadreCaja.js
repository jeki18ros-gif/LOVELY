export const calcularArqueo = (esperadoTotal, totalContado) => {
  const esperado = Number(esperadoTotal || 0);
  const contado = Number(totalContado || 0);
  const esDeficitSinConteo = esperado < 0 && contado === 0;
  const diferencia = esDeficitSinConteo
    ? 0
    : Number((contado - esperado).toFixed(2));

  let estado = 'Cuadrado';
  if (esDeficitSinConteo) estado = 'Déficit / Pérdida';
  else if (diferencia < 0) estado = 'Faltante';
  else if (diferencia > 0) estado = 'Sobrante';

  return {
    diferencia,
    estado,
    deficitGlobal: Math.max(0, -esperado)
  };
};

export const calcularEsperadoCanal = (metodo, saldoCanal, baseInicial = 0) => {
  const saldo = Number(saldoCanal || 0) + (metodo === 'efectivo' ? Number(baseInicial || 0) : 0);
  const esDigital = metodo === 'yape' || metodo === 'plin' || metodo === 'tarjeta';

  return {
    esperado: esDigital ? Math.max(0, saldo) : saldo,
    deficit: Math.max(0, -saldo)
  };
};