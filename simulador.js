// ===== VARIABLES GLOBALES =====
let creditoAprobado = false;

// ===== FUNCIONES DE CÁLCULO =====
function calcularDisponible(ingreso, egreso){
  let res = ingreso - egreso;
  if (res <= 0) {
    res = 0;
  }
  return res;
}

function calcularTotalPagar(monto, interes){
  return monto + interes;
}

function calcularCuotaMensual(total, plazoAnios){
  let plazoMeses = plazoAnios * 12;
  let cuota = total / plazoMeses;
  return parseFloat(cuota.toFixed(2));
}

// ===== FUNCIÓN PRINCIPAL: CALCULAR =====
function calcular(){
  if (!validarFormulario()) {
    return;
  }

  let txtIngresos = recuperarFloat("txtIngresos");
  let txtEgresos = recuperarFloat("txtEgresos");
  let txtMonto = recuperarFloat("txtMonto");
  let txtPlazo = recuperarInt("txtPlazo");
  let txtTasaInteres = recuperarFloat("txtTasaInteres");

  let interes = calcularInteresSimple(txtMonto, txtTasaInteres, txtPlazo);
  let disponible = calcularDisponible(txtIngresos, txtEgresos);
  let capacidadPago = calcularCapacidadPago(disponible);
  let totalPagar = calcularTotalPagar(txtMonto, interes);
  let cuotaMes = calcularCuotaMensual(totalPagar, txtPlazo);

  // Aprobar o rechazar crédito
  creditoAprobado = aprobarCredito(capacidadPago, cuotaMes);

  // Mostrar resultados
  mostrarTexto("spnDisponible", "$" + disponible.toFixed(2));
  mostrarTexto("spnCapacidadPago", "$" + capacidadPago.toFixed(2));
  mostrarTexto("spnInteresPagar", "$" + interes.toFixed(2));
  mostrarTexto("spnTotalPrestamo", "$" + totalPagar.toFixed(2));
  mostrarTexto("spnCuotaMensual", "$" + cuotaMes.toFixed(2));

  // Actualizar estado del crédito
  let spnEstado = document.getElementById("spnEstadoCredito");
  if (creditoAprobado) {
    spnEstado.textContent = "✅ CRÉDITO APROBADO";
    spnEstado.style.color = "#10b981";
    spnEstado.style.fontWeight = "bold";
    spnEstado.style.background = "#d1fae5";
  } else {
    spnEstado.textContent = "❌ CRÉDITO RECHAZADO";
    spnEstado.style.color = "#ef4444";
    spnEstado.style.fontWeight = "bold";
    spnEstado.style.background = "#fee2e2";
  }

  // Controlar botón Asignar Crédito
  let btnAsignar = document.getElementById("btnAsignarCredito");
  btnAsignar.disabled = !creditoAprobado;
}

// ===== FUNCIÓN ASIGNAR CRÉDITO =====
function asignarCredito() {
  if (!creditoAprobado) {
    alert("⚠️ No se puede asignar un crédito rechazado");
    return;
  }

  let monto = recuperarFloat("txtMonto");
  let plazo = recuperarInt("txtPlazo");
  let tasa = recuperarFloat("txtTasaInteres");
  let cuota = document.getElementById("spnCuotaMensual").textContent;

  alert("✅ Crédito asignado exitosamente\n\n" +
        "Monto: $" + monto.toFixed(2) + "\n" +
        "Plazo: " + plazo + " años\n" +
        "Tasa: " + tasa + "%\n" +
        "Cuota mensual: " + cuota);

  console.log("✅ Crédito asignado:", { monto, plazo, tasa, cuota });
}

// ===== VALIDACIONES =====
function limpiarErrores() {
  const mensajes = document.querySelectorAll(".mensaje-error-input");
  mensajes.forEach(msg => msg.textContent = "");

  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    input.classList.remove("input-error");
    input.classList.remove("input-valido");
  });
}

function mostrarError(mensaje, idInput) {
  const input = document.getElementById(idInput);
  if (input) {
    input.classList.add("input-error");
    const spanError = input.parentElement.querySelector(".mensaje-error-input");
    if (spanError) {
      spanError.textContent = "⚠️ " + mensaje;
    }
  }
}

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

  input.classList.add("input-valido");
  return numero;
}

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

// ===== FUNCIÓN REINICIAR =====
function reiniciar() {
  // 1. Limpiar todos los inputs
  document.getElementById("txtIngresos").value = "";
  document.getElementById("txtEgresos").value = "";
  document.getElementById("txtMonto").value = "";
  document.getElementById("txtPlazo").value = "";
  document.getElementById("txtTasaInteres").value = "";

  // 2. Resetear los resultados
  mostrarTexto("spnDisponible", "$0.00");
  mostrarTexto("spnCapacidadPago", "$0.00");
  mostrarTexto("spnInteresPagar", "$0.00");
  mostrarTexto("spnTotalPrestamo", "$0.00");
  mostrarTexto("spnCuotaMensual", "$0.00");

  // 3. Resetear el estado del crédito
  let spnEstado = document.getElementById("spnEstadoCredito");
  spnEstado.textContent = "ANALIZANDO...";
  spnEstado.style.color = "";
  spnEstado.style.fontWeight = "";
  spnEstado.style.background = "";

  // 4. Deshabilitar botón de asignar
  document.getElementById("btnAsignarCredito").disabled = true;
  creditoAprobado = false;

  // 5. Limpiar errores
  limpiarErrores();

  // 6. Devolver el foco al primer input
  document.getElementById("txtIngresos").focus();

  console.log("✅ Formulario reiniciado correctamente");
}