# PrimasLigaPro

## Requisitos

  * Instalar la extensión de navegador Tampermonkey disponible para Chrome, Firefox y Opera.
  * Añadir el script .js al conjunto de scrpits de Tampermonkey.

## Instrucciones de Uso
### Leer Puntuaciones

  * Iniciar sesión en la app Web de LigaPro.
  * Entrar en la pestaña `Puntuaciones`
  * Si el script está instalado correctamente, se mostarará una notificación sobre el icono de extensión de Tampermonkey y aparecerá un botón `Leer Puntuaciones` en la parte superior de la página.
  *  Clickar el botón y comprobar en la ventana de notificación que aparecerá que los datos se han leido correctamente.

### Abonar Primas

  * Al pulsar el botón `Leer Puntuaciones` se abrirá una nueva pestaña con la vista de `Administración`. Tener en cuenta que está vista solo se cargará si el usuario con la sesión iniciada tiene permisos de administrador en la comunidad LigaPro que está gestionando.
  * Encima del formulario de abonar primas e imponer sanciones aparecerá un nuevo botón `Abonar Primas`. Pulsarlo y no tocar nada más.
  * Tardará unos minutos en función del número de usuarios de la comunidad. Al terminar aparecerá una ventana de notificación informando que no quedan primas que abonar.

### Consideraciones
  * **Jornadas atrasadas:** se pueden abonar primas de cualquier jornada atrasada. En la pestaña de puntuaciones hay un desplegable para seleccionar la jornada de la que se quiere ver las puntuaciones. El script leerá las puntuaciones que se estén mostrando en pantalla y notificará a que jornada corresponde la prima en la descripción de la prima.
  * **Puntuación Negativa:** en caso de que un usuario tenga una puntuación menor que 0, se le asignará una prima de 0€.
  * **No aparecen los botones:** los botones `Leer Puntuaciones` y `Abonar primas` se renderizan después de cargar el resto de la página, incluidos anuncios y scripts. Con una conexión lenta pueden tardar más en aparecer.
  *  **Caida durante la asignación de primas:** Si se interrumpe la conexión durante este proceso, o se cierra el navegador, las primas que ya se han asignado no se perderán. No es fiable intentar reanudar el proceso donde se quedó. Una opción para arreglar esto es observar que jugadores han recibido las primas y volver a visitar la página de puntuaciones para eliminar del HTML las tablas de esos usuarios (usando pej. la función inspeccionar elemento del navegador). Después se puede usar el botón `Leer Puntuaciones` para que abra la pestaña de administración solamente con los usuarios que aparecen en el HTML. 
