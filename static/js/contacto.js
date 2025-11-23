document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const modalExito = new bootstrap.Modal(document.getElementById('modalExito'));

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita recarga inicial
        
        // 1. Verificación de validez HTML5 (Required fields)
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated'); // Muestra los errores en rojo
            return; // Detiene el proceso si falta algo
        }

        // 2. Si todo es válido, capturamos los datos
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const asunto = document.getElementById('asunto').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Mensaje opcional en el modal
        const mensajeTexto = mensaje.trim() !== "" ? mensaje : "Sin detalles adicionales.";

        console.log("Datos válidos:", { nombre, email, asunto, mensaje });

        // 3. Poner los datos en el Modal
        document.getElementById('modalNombreUser').textContent = nombre;
        document.getElementById('modalEmailUser').textContent = email;
        document.getElementById('modalAsuntoUser').textContent = asunto;
        
        // Añadí este campo en el modal del HTML para mostrar el mensaje o "Sin detalles"
        const previewMsg = document.getElementById('modalMensajePreview');
        if(previewMsg) previewMsg.textContent = mensajeTexto;

        // 4. Mostrar el Modal y resetear formulario
        modalExito.show();
        form.reset();
        form.classList.remove('was-validated'); // Quitar estilos de validación
    });
});