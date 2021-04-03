//pics library
var pics = ["./assets/img1.png", "./assets/img2.png", "./assets/img3.png", "./assets/img4.png"];
//falling circles
var skew = 1;

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

(function frame() {
    skew = Math.max(0.8, skew - 0.001);

    confetti({
        particleCount: 1,
        startVelocity: 0,
        origin: {
            x: Math.random(),
            // since particles fall down, skew start toward the top
            y: (Math.random() * skew) - 0.05
        },
        colors: ['#ffdf91'],
        shapes: ['circle'],
        gravity: randomInRange(0.0, 0.01),
        scalar: randomInRange(0.15, 0.35),
        drift: randomInRange(-0.015, 0.025)
    });
    requestAnimationFrame(frame);
}());
//end of falling circles

//Switch from home screen to game screen when clicking the start button
$('#startGame').click(function () {
    $('#gameScreen').show();
    $('#homeScreen').hide();
    $('#startPuzzle').prop('disabled', true);
});
//switch back to home screen
$('#backBtn').click(function () {
    $('#gameScreen').hide();
    $('#homeScreen').show();
});
//choose the next picture
//reset game if it has been played
var played = false;
var num = 0;
$('#nextPic').click(function () {
    $('#startPuzzle').prop('disabled', false);
    //check if the game has been played if so then reset it
    if (played) {
        $('.pieces').empty();
        var newPieces = createPieces(true);
        $('.puzzle').html(newPieces);
    }
    switch (num) {
        case 0:
            $('.piece').css('background-image', 'url(' + pics[num] + ')');
            $('.completedPuzzle').css('background-image', 'url(' + pics[num] + ')');
            num = 1;
            break;
        case 1:
            $('.piece').css('background-image', 'url(' + pics[num] + ')');
            $('.completedPuzzle').css('background-image', 'url(' + pics[num] + ')');
            num = 2;
            break;
        case 2:
            $('.piece').css('background-image', 'url(' + pics[num] + ')');
            $('.completedPuzzle').css('background-image', 'url(' + pics[num] + ')');
            num = 3;
            break;
        default:
            $('.piece').css('background-image', 'url(' + pics[num] + ')');
            $('.completedPuzzle').css('background-image', 'url(' + pics[num] + ')');
            num = 0;
            break;
    }
});
//loops to generate the puzzle pieces div elements and set the image position for each piece
//and set an order for the pieces
var pieces;
function createPieces(img) {
    pieces = "";
    for (var i = 0, t = 0, order = 0; i < 4; i++, t -= 100) {
        for (var j = 0, left = 0; j < 4; j++, left -= 100, order++) {
            if (img) {
                pieces += '<div style = "background-position:' + left + "px " + t + 'px;" class="piece" data-order=' + order + '></div>';
            } else {
                pieces += '<div style = "background-image:none;" class="piece droppableSpace"></div>';
            }
        }
    }
    return pieces;
}

var pieces = createPieces(true);
$('.puzzle').html(pieces);

//move the perviously generated pieces to the pieces div and randomize their position
$('#startPuzzle').click(function () {
    $('#nextPic').prop('disabled', true);
    var puzzlePieces = $('.puzzle div');
    puzzlePieces.each(function () {
        var leftPosition = Math.floor(Math.random() * 250) + "px";
        var topPosition = Math.floor(Math.random() * 280) + "px";
        $(this).addClass("draggablePiece").css({
            position: 'absolute',
            left: leftPosition,
            top: topPosition
        });
        $('.pieces').append($(this));
    });

    //add lines to the puzzle div
    var lines = createPieces(false);
    $('.puzzle').html(lines);

    //disable start button after its invoked
    $(this).prop('disabled', true);
    //
    implementLogic();
});

//function to check if pieces were placed correctly
function checkPiecesOrder() {
    if ($('.puzzle .droppedPiece').length != 16) {
        return false;
    }
    for (let i = 0; i < 16; i++) {
        var item = $('.puzzle .droppedPiece:eq(' + i + ')');
        var order = item.data("order");
        if (i != order) {
            $('.pieces').html("Better luck next time!!");
            played = true;
            $('#nextPic').prop('disabled', false);
            return false;
        }
    }
    $('.pieces').html("Well done");
    played = true;
    $('#nextPic').prop('disabled', false);
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
    return true;
}
//function to add draggable() and droppable()
function implementLogic() {
    $('.draggablePiece').draggable({
        revert: "invalid",
        start: function () {
            if ($(this).hasClass("droppedPiece")) {
                $(this).removeClass("droppedPiece");
                $(this).parent().removeClass("piecePresent");
            }
        }
    });
    $('.droppableSpace').droppable({
        hoverClass: "highlight",
        accept: function () {
            return !$(this).hasClass("piecePresent")
        },
        drop: function (event, ui) {
            var draggableElement = ui.draggable;
            var droppedOn = $(this);
            droppedOn.addClass("piecePresent");
            $(draggableElement)
                .addClass("droppedPiece")
                .css({
                    top: 0,
                    left: 0,
                    position: "relative"
                }).appendTo(droppedOn);
            checkPiecesOrder();//to check if the puzzle has been solved 
        }
    });
}
