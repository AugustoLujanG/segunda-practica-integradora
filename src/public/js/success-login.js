Swal.fire({
  title: 'Registro exitoso',
  text: 'Tu registro ha sido exitoso. Redirigiendo al login...',
  icon: 'success',
  timer: 4000,
  showConfirmButton: false,
}).then(() => {
  window.location.href = '/';
});
