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
    console.log("aquiiiiii")
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


// ===== VALIDACIONES CON LA IA=====

// Función para limpiar errores de todos los inputs
function limpiarErrores() {
  // 1. Limpiar textos de los spans de error
  const mensajes = document.querySelectorAll(".mensaje-error-input");
  mensajes.forEach(msg => msg.textContent = "");
  
  // 2. Quitar clases de error/válido de todos los inputs
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    input.classList.remove("input-error");
    input.classList.remove("input-valido");
  });
}

// Función para mostrar error en el input específico
function mostrarError(mensaje, idInput) {
  const input = document.getElementById(idInput);
  if (input) {
    input.classList.add("input-error");
    // Busca el span hermano que está justo debajo del input
    const spanError = input.parentElement.querySelector(".mensaje-error-input");
    if (spanError) {
      spanError.textContent = "⚠️ " + mensaje;
    }
  }
}

// Función para validar un campo numérico
function validarCampoNumerico(idInput, nombreCampo, permitirDecimales = false) {
  const input = document.getElementById(idInput);
  if (!input) return null;
  
  const valor = input.value.trim();
  
  if (valor === "") {
    mostrarError(`El campo "${nombreCampo}" no puede estar vacío.`, idInput);
    return null;
  }
  
  const regexNumeros = permitirDecimales ? /^\d+(\.\d+)?$/ : /^\d+$/;
  if (!regexNumeros.test(valor)) {
    mostrarError(`El campo "${nombreCampo}" solo acepta números.`, idInput);
    return null;
  }
  
  const numero = permitirDecimales ? parseFloat(valor) : parseInt(valor);
  
  if (numero <= 0) {
    mostrarError(`El campo "${nombreCampo}" debe ser mayor a 0.`, idInput);
    return null;
  }
  
  // Si todo está bien, marcar como válido
  input.classList.add("input-valido");
  return numero;
}

// Función principal de validación
function validarFormulario() {
  limpiarErrores();
  let esValido = true;
  
  if (validarCampoNumerico("txtIngresos", "Ingresos", true) === null) esValido = false;
  if (validarCampoNumerico("txtEgresos", "Egresos", true) === null) esValido = false;
  if (validarCampoNumerico("txtMonto", "Monto del crédito", true) === null) esValido = false;
  if (validarCampoNumerico("txtPlazo", "Plazo", false) === null) esValido = false;
  if (validarCampoNumerico("txtTasaInteres", "Tasa de interés", true) === null) esValido = false;
  
  return esValido;
}

// Modificar la función calcular para incluir validaciones
const calcularOriginal = calcular;
calcular = function() {
  if (!validarFormulario()) {
    return; // Si hay errores, se detiene aquí y no calcula
  }
  calcularOriginal(); // Si todo está válido, ejecuta el cálculo original
};


// ===== FUNCIÓN REINICIAR =====
function reiniciar() {
  // 1. Limpiar todos los inputs
  document.getElementById("txtIngresos").value = "";
  document.getElementById("txtEgresos").value = "";
  document.getElementById("txtMonto").value = "";
  document.getElementById("txtPlazo").value = "";
  document.getElementById("txtTasaInteres").value = "";
  
  // 2. Resetear los resultados a valores iniciales
  mostrarTexto("spnDisponible", "0.00");
  mostrarTexto("spnCapacidadPago", "0.00");
  mostrarTexto("spnInteresPagar", "0.00");
  mostrarTexto("spnTotalPrestamo", "0.00");
  mostrarTexto("spnCuotaMensual", "0.00");
  
  // 3. Resetear el estado del crédito
  let spnEstado = document.getElementById("spnEstadoCredito");
  spnEstado.textContent = "ANALIZANDO...";
  spnEstado.style.color = ""; // Quitar color
  spnEstado.style.fontWeight = ""; // Quitar negrita
  
  // 4. Limpiar errores de validación
  limpiarErrores();
  
  // 5. Quitar clases de error/valido de todos los inputs
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    input.classList.remove("input-error");
    input.classList.remove("input-valido");
  });
  
  // 6. Devolver el foco al primer input
  document.getElementById("txtIngresos").focus();
  
  console.log("✅ Formulario reiniciado correctamente");
}