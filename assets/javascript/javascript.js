var topics = ["BlazBlue", "Street Fighter", "Guilty Gear", "Tekken"];

$(document).ready(function () {
    showTopics(topics);
    $("#topics-header").on("click", "button", function () {
        searchTopic($(this).text());
    });
    $("#topic-adder > button").on("click", function () {
        topics.push(`${$("#topic-adder > input").val()}`);
        showTopics(topics);
        $("#topic-adder > input").val("");
    });
});

function showTopics(topics) {
    $("#topics-header").empty();
    for (topic of topics) {
        $("#topics-header").append($('<button>').text(topic));
    }
}

function searchTopic(topic) {
    topic = topic.replace(" ", "+").trim();
    var queryURL = `https://api.giphy.com/v1/gifs/search?api_key=tpot9EY8hIuY4BowNhBLKQQmrjeM7IEt&q=${topic}&limit=10&rating=pg-13`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        $("#image-location").empty();
        for (data of response.data) {
            addGiphyImage(
                data.images.downsized.url,
                data.images.downsized_still.url,
                data.images.original.url,
                data.rating,
                data.id);
        }
        $("#image-location > div > img").mousedown(function (event) {
            button = $(this);
            if ($("#tempImage").length) {
                $("#tempImage").remove();
            }
            if (event.which == 1) {
                if (button.attr("data-state") == "still") {
                    button.attr("data-state", "animate");
                    button.attr("src", button.attr("data-animate"));
                } else if (button.attr("data-state") == "animate") {
                    button.attr("data-state", "still");
                    button.attr("src", button.attr("data-still"));
                }
            } else if (event.which == 2) {
                var tempImage = $('<img id="tempImage">');
                tempImage.attr("src", button.attr("value"));
                $("#image-location").append(tempImage);
                $("#tempImage").mousedown(function () {
                    $("#tempImage").remove();
                });
            }
        });
    });
}

function addGiphyImage(lowResImage, lowResImageStill, image, rating, id) {
    var ratingDiv = $("<div>").text(`Rating: ${rating}`);
    var imageElement = $(`<img src="${lowResImageStill}" alt="${id}" value="${image}" data-still="${lowResImageStill}" data-animate="${lowResImage}" data-state="still">`)
    var newDiv = $("<div>");
    newDiv.append(ratingDiv);
    newDiv.append(imageElement);
    $("#image-location").append(newDiv);
}