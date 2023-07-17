const socket = io();

const chatBox = document.getElementById('input-msg');
const sendBtn = document.getElementById('send-btn');

let emailIngresado = '';

async function main() {
  try {
    const { value: email } = await Swal.fire({
      title: 'Enter your email',
      input: 'email',
      inputLabel: 'Your email',
      inputValue: '',
      inputPlaceholder: 'Enter your email address',
      showCancelButton: false,
      allowOutsideClick: false,
      if(email) {
        Swal.fire(`Entered email: ${email}`);
      },
    });

    emailIngresado = email;
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'An error occurred. Please try again later.',
    });
  }
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'An error occurred. Please try again later.',
    });
  }
})();

function sendMessage() {
  const message = chatBox.value.trim();

  if (message.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Mensaje vacío',
      text: 'Por favor, ingrese un mensaje antes de enviar.',
    });
    return;
  }

  socket.emit('msg_front_to_back', {
    message: message,
    user: emailIngresado,
  });

  chatBox.value = '';
}

chatBox.addEventListener('keyup', ({ key }) => {
  if (key == 'Enter') {
    sendMessage();
  }
});

chatBox.addEventListener('input', () => {
  const message = chatBox.value.trim();
  sendBtn.disabled = message === '';
});

sendBtn.addEventListener('click', sendMessage);

socket.on('listado_de_msgs', msgs => {
  const divMsgs = document.getElementById('div-msgs');
  let formato = '';

  msgs.forEach(msg => {
    // Agregar clase CSS según el remitente del mensaje
    const bubbleClass = msg.user === emailIngresado ? 'sent' : 'received';

    // Formato de la burbuja de mensaje
    formato +=
      msg.user === emailIngresado
        ? `
      <div class="message ${bubbleClass}">
        <p class="message-content">${msg.message}</p>
      </div>
    `
        : `
      <div class="message ${bubbleClass}">
        <p class="message-receiver">${msg.user}</p>
        <p class="message-content">${msg.message}</p>
      </div>
    `;
  });

  divMsgs.innerHTML = formato;
  divMsgs.scrollTop = divMsgs.scrollHeight; // Scroll automático hacia abajo
});
