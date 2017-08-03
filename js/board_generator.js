function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function fill_empty(board, board_flip, tile_count, tile, flip_tile) {
    _.times(tile_count, function () {
        var empty_tile = false;
        while (!empty_tile) {
            var x = getRandomInt(0, board.length);
            var y = getRandomInt(0, board[0].length);
            if (board[x][y].class == 'neutral' && board_flip[x][y].class == flip_tile.class) {
                board[x][y] = tile;
                empty_tile = true;
            }
        }
    });
}

function BoardGenerator() {
    var vm = this;
    var GOOD_FRONT = 9;
    var BAD_FRONT = 3;
    var BAD_BAD = 1;
    var BAD_NEUTRAL = 1;
    var BAD_GOOD = 1;
    var GOOD_BAD = 1;
    var GOOD_GOOD = 3;
    var GOOD_NEUTRAL = 6;
    var GOOD = {
        class: 'good',
        display: '✔'
    };
    var NEUTRAL = {
        class: 'neutral',
        display: '⛔'
    };
    var BAD = {
        class: 'bad',
        display: '⚠'
    };
    vm.seed_text = "";
    vm.row_count = 5;
    vm.col_count = 5;
    vm.board_front = [];
    vm.board_back = [];

    vm.build_board = function() {
        vm.board_front = _.times(vm.row_count, function() {return _.times(vm.col_count, _.constant(NEUTRAL))});
        vm.board_back = _.times(vm.row_count, function() {return _.times(vm.col_count, _.constant(NEUTRAL))});
        Math.seedrandom(md5(vm.seed_text));
        fill_empty(vm.board_front, vm.board_back, GOOD_FRONT, GOOD, NEUTRAL);
        fill_empty(vm.board_front, vm.board_back, BAD_FRONT, BAD, NEUTRAL);
        fill_empty(vm.board_back, vm.board_front, BAD_BAD, BAD, BAD);
        fill_empty(vm.board_back, vm.board_front, BAD_NEUTRAL, BAD, NEUTRAL);
        fill_empty(vm.board_back, vm.board_front, BAD_GOOD, BAD, GOOD);
        fill_empty(vm.board_back, vm.board_front, GOOD_BAD, GOOD, BAD);
        fill_empty(vm.board_back, vm.board_front, GOOD_GOOD, GOOD, GOOD);
        fill_empty(vm.board_back, vm.board_front, GOOD_NEUTRAL, GOOD, NEUTRAL);
    }
}

app.controller('BoardGenerator', BoardGenerator);