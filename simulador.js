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


// ===== VALIDACIONES CON LA IA=====

// Función para limpiar errores anteriores
function limpiarErrores() {
  const contenedor = document.getElementById("contenedorErrores");
  if (contenedor) {
    contenedor.innerHTML = "";
  }
  
  // Quitar clase de error de todos los inputs
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    input.classList.remove("input-error");
    input.classList.remove("input-valido");
  });
}

// Función para mostrar un mensaje de error
function mostrarError(mensaje, idInput = null) {
  const contenedor = document.getElementById("contenedorErrores");
  if (!contenedor) return;
  
  const divError = document.createElement("div");
  divError.className = "mensaje-error";
  divError.innerHTML = `
    <span class="icono-error">️</span>
    <span>${mensaje}</span>
  `;
  contenedor.appendChild(divError);
  
  // Marcar el input con error si se proporcionó el ID
  if (idInput) {
    const input = document.getElementById(idInput);
    if (input) {
      input.classList.add("input-error");
    }
  }
}

// Función para validar un campo numérico
function validarCampoNumerico(idInput, nombreCampo, permitirDecimales = false) {
  const input = document.getElementById(idInput);
  if (!input) return null;
  
  const valor = input.value.trim();
  
  // Validar que no esté vacío
  if (valor === "") {
    mostrarError(`El campo "${nombreCampo}" no puede estar vacío.`, idInput);
    return null;
  }
  
  // Validar que solo contenga números
  const regexNumeros = permitirDecimales ? /^\d+(\.\d+)?$/ : /^\d+$/;
  if (!regexNumeros.test(valor)) {
    mostrarError(`El campo "${nombreCampo}" solo acepta números.`, idInput);
    return null;
  }
  
  // Validar cantidad de dígitos (5 dígitos para montos grandes)
  const numero = permitirDecimales ? parseFloat(valor) : parseInt(valor);
  const digitos = valor.replace(".", "").length;
  
  if (digitos < 5) {
    mostrarError(`El campo "${nombreCampo}" debe tener al menos 5 dígitos.`, idInput);
    return null;
  }
  
  // Validar que sea mayor a 0
  if (numero <= 0) {
    mostrarError(`El campo "${nombreCampo}" debe ser mayor a 0.`, idInput);
    return null;
  }
  
  // Marcar como válido
  input.classList.add("input-valido");
  return numero;
}

// Función principal de validación
function validarFormulario() {
  limpiarErrores();
  
  let esValido = true;
  
  // Validar Ingresos (permite decimales, mínimo 5 dígitos)
  const ingresos = validarCampoNumerico("txtIngresos", "Ingresos", true);
  if (ingresos === null) esValido = false;
  
  // Validar Egresos (permite decimales, mínimo 5 dígitos)
  const egresos = validarCampoNumerico("txtEgresos", "Egresos", true);
  if (egresos === null) esValido = false;
  
  // Validar Monto (permite decimales, mínimo 5 dígitos)
  const monto = validarCampoNumerico("txtMonto", "Monto del crédito", true);
  if (monto === null) esValido = false;
  
  // Validar Plazo (solo enteros, mínimo 5 dígitos)
  const plazo = validarCampoNumerico("txtPlazo", "Plazo", false);
  if (plazo === null) esValido = false;
  
  // Validar Tasa de Interés (permite decimales, mínimo 5 dígitos)
  const tasa = validarCampoNumerico("txtTasaInteres", "Tasa de interés", true);
  if (tasa === null) esValido = false;
  
  return esValido;
}

// Modificar la función calcular para incluir validaciones
const calcularOriginal = calcular;
calcular = function() {
  // Primero validar el formulario
  if (!validarFormulario()) {
    return; // Si hay errores, no continuar
  }
  
  // Si todo está válido, ejecutar el cálculo original
  calcularOriginal();
};