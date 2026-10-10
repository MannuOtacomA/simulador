function calcularCapacidadPago(montoDisponible){
    return montoDisponible / 2;
}


function calcularInteresSimple(monto,tasa,plazoAnios){
   // Fórmula: Interés = Monto × Tasa × Plazo
    let interes = monto * (tasa / 100) * plazoAnios;
    return parseFloat(interes.toFixed(2));
}


function aprobarCredito(capacidadPago, cuotaMensual) {
    if (capacidadPago > cuotaMensual) {
        return true;
    } else {
        return false;
    }
}