//Representa el mapa geográfico
var map;

//Representa el marker que establece el usuario
var userMarker;

//Representa el marker de un lugar
var imageMarker;

//Variable booleana para saber si el jugador ha confirmado la imagen
var confirmed = false;

//Lista de imágenes a mostrar
var images = []

//número de imagen actual
var numberImage = 0;

//Representa la polilínea que se dibuja cuando el usuario pulsa en confirmar
var poly;

//Representa la puntuación total del usuario
var totalPuntuation = 0.0;

//Representan los 4 círculos concéntricos;
var circle1; var circle2; var circle3; var circle4;


//Se cargan las imágenes
loadImages();
//Se carga la primera imágen 
loadImage();
//Se desactiban los botones de de confirmar y siguiente imagen
document.getElementById("confirmar").setAttribute("disabled", "");
document.getElementById("next").setAttribute("disabled", "");


/**
 * Inicialización del mapa
 */
function initMap() {
    var misOpciones = {
        center: {lat: 43.354810, lng: -5.851805},
        zoom: 9,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        mapTypeControl: false,
        streetViewControl: false
    };
    map = new google.maps.Map(document.getElementById("map_frame"), misOpciones);

    google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng);
    });
}

/**
 * Carga la imagen para que sea visible por el usuario
 */
function loadImage(){
    document.getElementById("image").src = images[numberImage]['path']
}

/**
 * Añade un marcador al mapa en la posición seleccionada por el usuario
 * @param {*} location 
 */
function addMarker(location) {
    if(!confirmed){
        //Se borra el marker si es que lo hay
        if(userMarker != undefined){
            userMarker.setMap(null);
        }
        userMarker = new google.maps.Marker({
            position: location,
            map: map
        });
        userMarker.setMap(map);

        //Se activa el botón de confirmar
        document.getElementById("confirmar").removeAttribute("disabled", "");
    }
}

/**
 * Devuelve el contenido de un infoView a partir del título y la descripción que se pasan como parámetro
 * @param {*} title, título del infoView
 * @param {*} description  descripción del infoView
 */
function getInfoView(title, description){
    var info = '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        '<h1 id="firstHeading" class="firstHeading">' + title + '</h1>' +
        '<div id="bodyContent">' +
        "<p>" + description + "</p>" +
        "</div>" +
        "</div>";
    return info;
}

/**
 * Muestra el marker de la imagen en cuestión
 */
function showImage(){
    var iconBase =
            'img/imageMarker.png';
            
    var infowindow = new google.maps.InfoWindow({
        content: getInfoView(images[numberImage]['title'], images[numberImage]['description'])
        });
        
    imageMarker = new google.maps.Marker({
        position: new google.maps.LatLng(images[numberImage]['latitude'], images[numberImage]['longitude']),
        title: images[numberImage]['title'],
        icon: iconBase,
        map: map
    });
    imageMarker.addListener('click', function() {
        infowindow.open(map, imageMarker);
    });
    imageMarker.setMap(map)
    confirmed = true;

    //Se activa el botón de siguiente imagen y se desactiva el de confirmar
    document.getElementById("next").removeAttribute("disabled", "");
    document.getElementById("confirmar").setAttribute("disabled", "");

    //Mostramos una polilínea entre los puntos establecidos
    showPolyline();
    //Mostramos los círculos concéntricos
    showCircles();
    //Calcula la distancia
    let d = 0.0;
    d = distance();
    //Calcula la puntuación
    score(d)

    if(numberImage == 9){
        document.getElementById("next").setAttribute("disabled", "");
    }
}

/**
 * Calcula la puntuación del usuario en función de la distancia entre los dos puntos
 */
function score(distance){
    let points = 0.0;
    //Primer círculo concéntrico
    if(distance <= 4.0 ){
        points += 10;
    }
    //Segundo círculo concéntrico
    else if(distance > 4.0 && distance <= 14.0){
        points += 7.5
    }
    //Tercer círculo concéntrico
    else if(distance > 14.0 && distance <= 24.0){
        points += 5.0
    }
    //Cuarto círculo concéntrico
    else if(distance > 24.0 && distance <= 34.0){
        points += 2.5
    }
    totalPuntuation += points;
    document.getElementById("imageScore").innerHTML  = "PUNTUACI\u00d3N EN LA IMAGEN: <strong>" + points + " puntos</strong>."
    document.getElementById("totalScore").innerHTML  = "PUNTUACI\u00d3N TOTAL ACUMULADA: <strong>" + totalPuntuation + " puntos</strong>."
    document.getElementById("averageScore").innerHTML  = "PUNTUACI\u00d3N MEDIA: <strong>" + 
        (Math.round(((totalPuntuation/(numberImage + 1)) + Number.EPSILON) * 100) / 100) + " puntos</strong>."
}

/**
 * Calcula la distancia entre los dos puntos seleccionados
 */
function distance(){
    //Se calcula la distancia de la polilínea
    let distance = 
        (google.maps.geometry.spherical.computeDistanceBetween(userMarker.getPosition(), imageMarker.getPosition())) / 1000;
    document.getElementById("distance").innerHTML  = 
        "DISTANCIA ENTRE LOS PUNTOS: <strong>" + (Math.round((distance + Number.EPSILON) * 100) / 100) + " Km</strong>";
    return distance;
}

/**
 * Muestra una polilínea en el mapa
 */
function showPolyline(){
    poly = new google.maps.Polyline({
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map
    });
    const path = [userMarker.getPosition(), imageMarker.getPosition()];
    poly.setPath(path);
}

/**
 * Muestra los 4 círculos concéntricos de la distancia
 */
function showCircles(){
    var i;
    let number = 1;
    for (i = 4000; i < 40000; i+= 10000)
    {
        var circuloOptions = {
            strokeColor: '#ff0015',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#fffbbd',
            fillOpacity: 0.15,
            map: map,
            center: imageMarker.getPosition(),
            radius: i
        };
        if(number == 1) circle1 = new google.maps.Circle(circuloOptions);		
        if(number == 2) circle2 = new google.maps.Circle(circuloOptions);	
        if(number == 3) circle3 = new google.maps.Circle(circuloOptions);	
        if(number == 4) circle4 = new google.maps.Circle(circuloOptions);	
        number += 1
    }
}

/**
 * Realiza el paso a la siguiente imagen y limpia el mapa de los puntos especificados
 */
function nextImage(){
    //Se suma una unidad en el array de imágenes
    numberImage += 1;
    //Se carga la imagen
    loadImage();
    //Se limpia el mapa
    resetMapElements();
    document.getElementById("imageScore").innerHTML  = ""
}

/**
 * Inicia una nueva partida
 */
function newGame(){
    numberImage = 0;
    totalPuntuation = 0.0;
    loadImage();
    resetMapElements();
    document.getElementById("imageScore").innerHTML  = ""
    document.getElementById("totalScore").innerHTML  = ""
    document.getElementById("averageScore").innerHTML  = ""
}

/**
 * Limpia el mapa de los componentes del usuario
 */
function resetMapElements(){
    //Se limpia el mapa
    if(userMarker != undefined){
        userMarker.setMap(null);
    }
    if(imageMarker != undefined){
        imageMarker.setMap(null);
    }
    if(poly != undefined){
        poly.setMap(null);
    }
    if(circle1 != undefined){
        circle1.setMap(null);
    }
    if(circle2 != undefined){
        circle2.setMap(null);
    }
    if(circle3 != undefined){
        circle3.setMap(null);
    }
    if(circle4 != undefined){
        circle4.setMap(null);
    }
    confirmed = false;
    //Se pone a disabled el botón de confirmar y siguiente imagen
    document.getElementById("confirmar").setAttribute("disabled", "");
    document.getElementById("next").setAttribute("disabled", "");
    document.getElementById("distance").innerHTML  = "";
}






/**
 * Función que se encarga de cargar las imágenes en el array
 */
function loadImages(){
    var lagos = {
        path: 'img/covadonga.jpg',
        title: "Lagos de Covadonga",
        description: "Tranquilo paraje natural con 2 lagos, numerosas rutas de senderismo y vistas espectaculares. En concreto se pueden observar los lagos de Enol y de La Ercina",
        latitude: 43.272539, 
        longitude: -4.992225
    }
    images.push(lagos);

    var caboPenas = {
        path: 'img/caboPenas.jpg',
        title: "Cabo Pe\u00f1as",
        description: "El cabo de Pe\u00f1as es el cabo m\u00e1s septentrional del Principado de Asturias, Espa\u00f1a, y est\u00e1 situado en la Mancomunidad Cabo Pe\u00f1as, formada por los concejos de Goz\u00f3n y Carre\u00f1o",
        latitude: 43.661727, 
        longitude: -5.848562
    }
    images.push(caboPenas);

    var ganzabal = {
        path: 'img/ganzabal.jpg',
        title: "Estadio Nuevo Ganz\u00e1bal",
        description: "El Nuevo Ganz\u00e1bal es una remodelaci\u00f3n del viejo estadio del Uni\u00f3n Popular de Langreo (Ganz\u00e1bal). En dicho estadio juega el Langreo sus partidos como local y tiene un aforo para 4024 espectadores",
        latitude: 43.302181,
        longitude: -5.689797
    }
    images.push(ganzabal)

    var naranco = {
        path: 'img/naranco.jpg',
        title: "Naranco",
        description: "El monte Naranco es una sierra en cuya falda meridional se encuentra la ciudad de Oviedo, incluso existe un barrio que toma su nombre, Ciudad Naranco. Forma un arco de unos 6 kil\u00f3metros, cuyo extremo noroeste apunta a la parroquia de Villaperi y el extremo oeste a Lloriana.",
        latitude: 43.380444, 
        longitude: -5.865027
    }
    images.push(naranco);

    var carbayu = {
        path: 'img/carbayu.jpg',
        title: "El Carbayu",
        description: "El Santuario de la Virgen del Carbayu es el santuario donde se venera a Nuestra Se\u00f1ora del Carbayu, patrona del concejo asturiano de Langreo (Espa\u00f1a).",
        latitude: 43.281406, 
        longitude: -5.687194
    }
    images.push(carbayu);

    var gulpiyuri = {
        path: 'img/gulpiyuri.jpg',
        title: "Playa de Gulpiyuri",
        description: "La playa de Gulpiyuri es una peque\u00f1a playa situada en el concejo de Llanes, al norte del pueblo de Naves.​ Fue declarada monumento natural el 26 de diciembre de 2001, adem\u00e1s de formar parte del Paisaje Protegido de la Costa Oriental de Asturias",
        latitude: 43.447564, 
        longitude:  -4.885971
    }
    images.push(gulpiyuri);

    var cudillero = {
        path: 'img/cudillero.jpg',
        title: "Cudillero",
        description: "Cudillero​​ es un concejo, parroquia y localidad de la comunidad aut\u00f3noma del Principado de Asturias, Espa\u00f1a. Limita al oeste con Vald\u00e9s, al sur con Salas y Pravia y al este con Muros del Nal\u00f3n y Pravia de nuevo.",
        latitude: 43.563295, 
        longitude:  -6.146047
    }
    images.push(cudillero);

    var oscos = {
        path: 'img/oscos.jpg',
        title: "Villanueva de Oscos",
        description: "Villanueva de Oscos es un concejo espa\u00f1ol perteneciente a la comunidad aut\u00f3noma del Principado de Asturias. Es uno de los municipios en los que se habla eonaviego.",
        latitude: 43.311697,
        longitude:   -6.986835
    }
    images.push(oscos);

    var jurasico = {
        path: 'img/jurasico.jpg',
        title: "Parque Jur\u00e1sico de Colunga, El Muja",
        description: "El Museo del Jur\u00e1sico de Asturias (MUJA) es un peque\u00f1o museo paleontol\u00f3gico espa\u00f1ol que se encuentra aislado en la rasa costera de San Telmo, entre las localidades asturianas de Colunga y Lastres, donde se han encontrado vestigios de dinosaurios que habr\u00edan poblado la regi\u00f3n hace unos 150 millones de a\u00f1os, durante la \u00faltima parte del Jur\u00e1sico.",
        latitude: 43.501246, 
        longitude:   -5.274071
    }
    images.push(jurasico);

    var toros = {
        path: 'img/plaza.jpg',
        title: "Plaza de toros El Bibio",
        description: "La plaza fue inaugurada en 1888, siendo edificada en estilo neomud\u00e9jar, en las afueras de Gij\u00f3n por aquel entonces, junto a la carretera de Villaviciosa. La construcci\u00f3n de la plaza de toros se inicia en el a\u00f1o 1886 bajo la direcci\u00f3n del arquitecto Ignacio de Velasco y el dise\u00f1o de Carlos Velasco Peyronnet.",
        latitude: 43.534968, 
        longitude: -5.645209
    }
    images.push(toros);
}

