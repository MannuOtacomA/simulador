function calcularDisponible(ingreso,egreso){
    let res = ingreso - egreso;
    if (res <= 0) {
        res = 0;
    }
    return res;
}


function calcularTotalPagar(monto,interes){
    return monto + interes;
}


function calcularCuotaMensual(total,plazoAnios){
    // Convertir años a meses y calcular cuota mensual
    let plazoMeses = plazoAnios * 12;
    let cuota = total / plazoMeses;
    return parseFloat(cuota.toFixed(2)); // Retornar con 2 decimales
   // return total / plazoAnios;
}


function calcular(){
    let txtIngresos = recuperarFloat("txtIngresos");
    let txtEgresos = recuperarFloat("txtEgresos");

    let txtMonto = recuperarInt("txtMonto");
    let txtPlazo = recuperarInt("txtPlazo");
    let txtTasaInteres = recuperarInt("txtTasaInteres");
    let interes = calcularInteresSimple(txtMonto,txtTasaInteres,txtPlazo)

    let disponible = calcularDisponible(txtIngresos,txtEgresos);
    let capacidadPago = calcularCapacidadPago(disponible);
    
    let totalPagar = calcularTotalPagar(txtMonto,interes);    

    let cuotaMes = calcularCuotaMensual(totalPagar,txtPlazo);

    //Invocar aprobarCredito y guardar resultado
    let creditoAprobado = aprobarCredito(capacidadPago, cuotaMes);

    mostrarTexto("spnDisponible",disponible);
    mostrarTexto("spnCapacidadPago",capacidadPago);
    mostrarTexto("spnInteresPagar",interes);
    mostrarTexto("spnTotalPrestamo",totalPagar);
    mostrarTexto("spnCuotaMensual",cuotaMes);


     let spnEstado = document.getElementById("spnEstadoCredito");
    
    if (creditoAprobado) {
        // APROBADO
        spnEstado.textContent = "CREDITO APROBADO ";
        spnEstado.style.color = "#10b981"; // Verde
        spnEstado.style.fontWeight = "bold";
    } else {
        // RECHAZADO
        spnEstado.textContent = "CREDITO RECHAZADO ";
        spnEstado.style.color = "#ef4444"; // Rojo
        spnEstado.style.fontWeight = "bold";
    }


}




