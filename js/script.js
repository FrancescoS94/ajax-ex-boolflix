// Milestone 1:
// Creare un layout base con una searchbar (una input e un button)
// in cui possiamo scrivere completamente o parzialmente il nome di un film.
// Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono
// ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori
// per ogni film trovato:
// 1 - Titolo
// 2 - Titolo Originale
// 3 - Lingua
// 4 - Voto.
// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da
// permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5,
// lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze
// piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera
// della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della
// nazione ritornata dall’API (le flag non ci sono in FontAwesome).
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca
// dovremo prendere sia i film che corrispondono alla query, sia le serie tv,
// stando attenti ad avere alla fine dei valori simili
// (le serie e i film hanno campi nel JSON di risposta diversi,
// simili ma non sempre identici).


$(document).ready(function() {

    $("#btn-click").click(function() {   // Al click del Button, attivo le funzioni.

        var search = $("#input").val(); // Salvo nella variabile il valore dell'input.
        reset();   // Svuoto il campo di ricerca.
        searchFilm(search);   // Richiamo la funzione per cercare e stampare la lista della ricerca dei film.
        searchSerie(search);
    });

    $("#input").keyup(function() {   // Pigiando su invio, attivo le funzioni.
        if (event.which == 13 || event.keyCode == 13) {
            var search = $("#input").val();
            reset();
            searchFilm(search);
            searchSerie(search);
        }
    });
});

// ** FUNZIONI **
function reset() {   // Funzione per svuotare il campo di ricerca.
    $(".lista-film").empty();
    $("#input").val("");
};

function searchFilm(data) {   // Funzione per cercare e stampare la lista dei dei film ricercati.
    $.ajax(   // Effettuo una chiamata API attraverso Ajax.
        {
            url: "https://api.themoviedb.org/3/search/movie",
            method: "GET",
            data: {
                api_key: "96df83a2ec59d64214d9e5a29ad76f29",
                query: data,
                language: "it-IT"
            },
            success: function(risposta) {
                if (risposta.total_results > 0) {
                    printFilm(risposta.results);
                } else {
                    noResults();
                }
            },
            error: function() {
                alert("Errore");
            }
        }
    );
};

function printFilm(data) {
    var source = $("#film-template").html();
    var template = Handlebars.compile(source);

    for (var i = 0; i < data.length; i++) {

        var context = {
            title: data[i].title,
            original_title: data[i].original_title,
            original_language: flag(data[i].original_language),
            vote_average: stars(data[i].vote_average)
        };
        var html = template(context);
        $(".lista-film").append(html);
    };
};

function searchSerie(data) {
    $.ajax(
        {
            url: "https://api.themoviedb.org/3/search/tv",
            method: "GET",
            data: {
                api_key: "96df83a2ec59d64214d9e5a29ad76f29",
                query: data,
                language: "it-IT"
            },
            success: function(risposta) {
                if (risposta.total_results < 0) {
                    printSerie(risposta.results);
                } else {
                    noResults();
                }
            },
            error: function() {
                alert("Errore");
            }
        }
    );
};

function printSerie(data) {
    var source = $("#film-template").html();
    var template = Handlebars.compile(source);

    var context = {
        title: data[i].name,
        original_title: data[i].original_name,
        original_language: flag(data[i].original_language),
        vote_average: stars(data[i].vote_average)
    };
    var html = template(context);
    $(".lista-film").append(html);
};

function flag(language) {
    var resultFlag = "";
    if (language == "it") {
        resultFlag =  "<img src='img/it.png' width='20px'>";
    } else if (language == "en") {
        resultFlag = "<img src='img/en.png' width='20px'>";
    }
    return resultFlag;
};

function stars(vote) {
    var divisione = vote / 2;
    var arrotondamento = Math.ceil(divisione);
    var star = "";
    // var star += '<i class="fa fa-star"></i>';
    for (var i = 1; i <= 5; i++) {
        if (i <= arrotondamento) {
            star += '<i class="fa fa-star"></i>';
        } else {
            star += '<i class="fa fa-star-o"></i>';
        }
    };
    return star;
};

function noResult() {
    var source = $("#film-template").html();
    var template = Handlebars.compile(source);
    var context = {
        noResult: "non ci sono risultati"
    };
    var html = template(context);
    $(".lista-film").append(html);
};
