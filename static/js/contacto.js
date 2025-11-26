document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const tel = document.getElementById("telefono");
    const modalExito = new bootstrap.Modal(document.getElementById('modalExito'));
    //  BLOQUEAR LETRAS EN TELÉFONO
    
    tel.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, ""); 
    });

    form.addEventListener("submit", function (event) {

        // VALIDAR NOMBRE SOLO LETRAS
        const nombreValor = document.getElementById("nombre").value.trim();
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(nombreValor)) {
            event.preventDefault();
            alert("El nombre solo puede contener letras.");
            return;
        }

        // VALIDAR TELÉFONO 9–10 DÍGITOS
        const telefonoValor = tel.value.trim();
        if (!/^[0-9]{9,10}$/.test(telefonoValor)) {
            event.preventDefault();
            alert("El teléfono debe tener entre 9 y 10 números.");
            return;
        }
    });
    //  VALIDACIÓN PRINCIPAL + MODAL
  
    form.addEventListener('submit', function(event) {

        event.preventDefault(); // Evita recarga

        // VALIDACIÓN HTML5
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        // CAPTURAR DATOS
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const asunto = document.getElementById('asunto').value;
        const mensaje = document.getElementById('mensaje').value;

        const mensajeTexto = mensaje.trim() !== "" ? mensaje : "Sin detalles adicionales.";

        console.log("Datos válidos:", { nombre, email, asunto, mensaje });

   
        document.getElementById('modalNombreUser').textContent = nombre;
        document.getElementById('modalEmailUser').textContent = email;
        document.getElementById('modalAsuntoUser').textContent = asunto;

        const previewMsg = document.getElementById('modalMensajePreview');
        if (previewMsg) previewMsg.textContent = mensajeTexto;

      
        modalExito.show();

      
        form.reset();
        form.classList.remove('was-validated');
    });

});
