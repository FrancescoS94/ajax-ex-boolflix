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

$(document).ready(function() {
    $("#btn-click").click(function() {
        var ricerca = $("#input").val();
        $(".lista-film").empty();
        $.ajax(
            {
                url: "https://api.themoviedb.org/3/search/movie",
                method: "GET",
                data: {
                    api_key: "96df83a2ec59d64214d9e5a29ad76f29",
                    query: ricerca,
                    language: "it-IT"
                },
                success: function(risposta) {
                    for (var i = 0; i < risposta.results.length; i++) {
                        var source = $("#film-template").html();
                        var template = Handlebars.compile(source);

                        var context = {
                            title: risposta.results[i].title,
                            original_title: risposta.results[i].original_title,
                            original_language: risposta.results[i].original_language,
                            vote_average: risposta.results[i].vote_average
                        };
                        var html = template(context);
                        $(".lista-film").append(html);
                    };
                },
                error: function() {
                    alert("Errore");
                }
            }
        );
    });
});
