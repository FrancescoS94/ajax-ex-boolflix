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
        var url1 = 'https://api.themoviedb.org/3/search/movie';
        var url2 = 'https://api.themoviedb.org/3/search/tv';

        chiamata(search, url1, "Film");   // Richiamo la funzione per cercare e stampare la lista della ricerca dei film.
        chiamata(search, url2, "SerieTV");
    });

    $("#input").keyup(function() {   // Pigiando su invio, attivo le funzioni.
        if (event.which == 13 || event.keyCode == 13) {
            var search = $("#input").val();
            reset();
            var url1 = 'https://api.themoviedb.org/3/search/movie';
            var url2 = 'https://api.themoviedb.org/3/search/tv';

            chiamata(search, url1, "Film");
            chiamata(search, url2, "SerieTV");
        }
    });
});

// ** FUNZIONI **
function reset() {   // Funzione per svuotare il campo di ricerca.
    $(".results-film .list").empty();
    $(".results-serietv .list").empty();
    $('.no-risultati').empty();
    $("#input").val("");
};

function chiamata(data, url, type) {   // Funzione per cercare e stampare la lista dei dei film ricercati.
    $.ajax(                   // Effettuo una chiamata API attraverso Ajax.
        {
            url: url,
            method: "GET",
            data: {
                api_key: "96df83a2ec59d64214d9e5a29ad76f29",
                query: data,
                language: "it-IT"
            },
            success: function(risposta) {
                if (risposta.total_results > 0) {
                    printResult(risposta.results, type);
                } else {
                    noResults(type);
                }
            },
            error: function() {
                alert("Errore");
            }
        }
    );
};

function printResult(data, type) {
    var source = $("#film-template").html();
    var template = Handlebars.compile(source);

    for (var i = 0; i < data.length; i++) {
        if (type == "Film") {
            var title = data[i].title;
            var original_title = data[i].original_title;
        } else if (type == "SerieTV") {
            var title = data[i].name;
            var original_title = data[i].original_name;
        }
        var context = {
            tipo: type,
            title: title,
            original_title: original_title,
            original_language: flag(data[i].original_language),
            vote_average: stars(data[i].vote_average)
        };
        var html = template(context);
        if (type == "Film") {
            $(".results-film .list").append(html);
        } else if (type == "SerieTV") {
            $(".results-serietv .list").append(html);
        }
    };
};

function flag(lingua) {
    var language = ["en", "it"];
    if (language.includes(lingua)) {
        return '<img src="img/'+lingua+'.png">';
    }
    return lingua;
};

function stars(vote) {     // Funzione per sostituire il voto con le stelle.
    var resto = vote % 2;
    vote = Math.floor(vote / 2);
    var star = "";
    for (var i = 1; i <= 5; i++) {
        if (i <= vote) {
            star += '<i class="fas fa-star"></i>';
        } else if (resto != 0) {
            star += '<i class="fas fa-star-half-alt"></i>';
            resto = 0;
        } else {
            star += '<i class="far fa-star"></i>';
        }
    };
    return star;
};

function noResult(type) {
    var source = $("#no-result-template").html();
    var template = Handlebars.compile(source);
    var context = {
        noResult: "non ci sono risultati" + type
    };
    var html = template(context);
    if (type == "Film") {
        $(".results-film .list").append(html);
    } else if (type == "SerieTV") {
        $(".results-serietv .list").append(html);
    }
};
