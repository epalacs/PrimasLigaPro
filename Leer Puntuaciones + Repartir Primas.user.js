// ==UserScript==
// @name         Leer Puntuaciones + Repartir Primas
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Ahora puede abonar primas de cualquier jornada ya realizada
// @author       You
// @match        http://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @include https://www.ligapromanager.com/LigaPro/cargarPuntuaciones.do*
// @include https://www.ligapromanager.com/LigaPro/cargarAdministracionComunidad.do
// @include https://www.ligapromanager.com/LigaPro/imponerPenaAbonoComunidad.do
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// ==/UserScript==

var prima_por_punto = 50000;

($( document ).ready(function() {
    'use strict';

    if (window.location.href.indexOf("https://www.ligapromanager.com/LigaPro/cargarPuntuaciones.do") > -1) {
        let input=document.createElement("input");
        input.type="button";
        input.value="Leer Puntuaciones";
        input.onclick = leerPuntuacion;
        input.style.fontSize = '20px';

        //Resetear usuarios
        GM_setValue("usuarios",{});
        console.log(GM_getValue("usuarios"));

        //Un poco guarro, pero habia muchas tablas con class=puntuacion y era dificil distinguirlas
        var cuerpo = $("body > form > table > tbody > tr > td > table.cuerpo > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table");

        cuerpo.prepend(input);

    } else if (window.location.href === "https://www.ligapromanager.com/LigaPro/cargarAdministracionComunidad.do"){
        let input=document.createElement("input");
        input.type="button";
        input.value="Abonar Primas";
        input.onclick = abonarPrimas;
        input.style.fontSize = '20px';

        $("span:contains('Sanciones / Abonos')").prepend(input);

    } else if (window.location.href === "https://www.ligapromanager.com/LigaPro/imponerPenaAbonoComunidad.do"){
        //Quitar el popup de confirmacion y seguir hasta que todos hayan recibido primas
        setTimeout(function() {
            if ( $(".jquery-msg-content:contains('Abono efectuado correctamente')").length > 0) {
                $("#jquery-msg-overlay").remove();
                abonarPrimas();
            } else {
                alert("ERROR: Ha habido un problema en la asignación de las primas");
            }
        }, 3000)

    }


function leerPuntuacion()
{

    var jornada = cuerpo.find(".h2.naranja")[1].innerText;
    var tablas = cuerpo.find("table.normal:has(.puntuacion)");
    var usuarios = [];

    tablas.each(function(){

        var user = $(this).find("tr.cabecera").text().trim();
        var puntuacion = $(this).find(".puntuacion").text().trim();
        if(Number.isNaN(puntuacion)) puntuacion = 0;

        var usuario = {}
        usuario.user = user;
        usuario.puntuacion = puntuacion;

        usuarios.push(usuario);
    });

    //Ordenar los usuarios de menor a mayor puntuacion
    usuarios.sort(function(a, b){
        return a.puntuacion - b.puntuacion;
    });

    GM_setValue("usuarios",JSON.stringify(usuarios));
    GM_setValue("jornada",JSON.stringify(jornada));

    console.log(GM_getValue("usuarios"));

    GM_openInTab("https://www.ligapromanager.com/LigaPro/cargarAdministracionComunidad.do");
    alert("En la nueva pestaña abierta se repartiran las primas a los siguientes jugadores: \n\n Puntuaciones de la jornada " + JSON.stringify(jornada,null,2) + "\n\n" +
          JSON.stringify(usuarios) +
          "\n\nPara continuar clickar en el botón 'Abonar Primas' de la otra pestaña. \n\nPara abortar cerrar ambas páginas y volver a empezar.")
}

function abonarPrimas()
    {
        console.log(GM_getValue("usuarios"));

        var usuarios = JSON.parse(GM_getValue("usuarios"));
        var jornada = JSON.parse(GM_getValue("jornada"));

        var receptor = $("#receptor")
        var tipo = $("#tipo")
        var cantidad = $("#cantidad")
        var motivo = $("#motivo")

        console.log(receptor)
        console.log(tipo)
        console.log(cantidad)
        console.log(motivo)

        console.log(usuarios);

        if (usuarios.length > 0) {
            var usuario = usuarios[usuarios.length-1];
            console.log(usuario);
            receptor.val(usuario.user);
            tipo.val('abono');
            motivo.val('Prima de la jornada ' + jornada + ': ' + usuario.puntuacion + ' puntos')

            cantidad.val((usuario.puntuacion*prima_por_punto).toLocaleString()); //LocaleString pone los puntos decimales

            console.log("Usuario: " + usuario + ": " + usuario.puntuacion );
            $(".boton:contains('ENVIAR')").click();

            setTimeout(function() {
                $(".botonConfirmSi").click()
                usuarios.splice(usuarios.length-1,1)
                GM_setValue("usuarios",JSON.stringify(usuarios));
            }, 2000)
        } else {
            alert("No quedan jugadores a los que repartir primas");
        };

    }
}));
