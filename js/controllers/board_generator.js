app.controller('BoardGenerator', BoardGenerator);

BoardGenerator.$inject = ['$http'];
function BoardGenerator($http) {
    var vm = this;
    var GOOD_FRONT = 9;
    var BAD_FRONT = 3;
    var BAD_BAD = 1;
    var BAD_NEUTRAL = 1;
    var BAD_GOOD = 1;
    var GOOD_BAD = 1;
    var GOOD_GOOD = 3;
    var GOOD_NEUTRAL = 5;
    var GOOD = {
        class: 'success',
        display: '<span class="glyphicon glyphicon-ok">&nbsp;</span>',//✔'
        word: null
    };
    var NEUTRAL = {
        class: 'default',
        display: '<span class="glyphicon glyphicon-minus">&nbsp;</span>', //'⛔'
        word: null
    };
    var BAD = {
        class: 'danger',
        display: '<i class="fa fa-bomb">&nbsp;</i>', //⚠'
        word: null
    };

    vm.wordlists = {};
    $http.get('wordlists.json').then(function(res) {
        vm.wordlists = res.data;
        vm.active_lists = _.mapValues(vm.wordlists, function() {return false});
        vm.randomize_seed();
    });

    vm.seed_text = "";
    vm.row_count = 5;
    vm.col_count = 5;
    vm.board_front = [];
    vm.board_back = [];
    vm.active_lists = {};

    vm.randomize_seed = function() {
        Math.seedrandom();
        var size = vm.wordlists['Base'].length;
        vm.seed_text = _.times(3, function() {
            return vm.wordlists['Base'][getRandomInt(0, size)][getRandomInt(0,2)];
        }).join('-');
        vm.build_board();
    };

    vm.build_board = function() {
        vm.board_front = _.times(vm.row_count, function() {return _.times(vm.col_count, _.constant(_.cloneDeep(NEUTRAL)))});
        vm.board_back = _.times(vm.row_count, function() {return _.times(vm.col_count, _.constant(_.cloneDeep(NEUTRAL)))});
        Math.seedrandom(md5(vm.seed_text));
        fill_empty(vm.board_front, vm.board_back, GOOD_FRONT, GOOD, NEUTRAL);
        fill_empty(vm.board_front, vm.board_back, BAD_FRONT, BAD, NEUTRAL);
        fill_empty(vm.board_back, vm.board_front, BAD_BAD, BAD, BAD);
        fill_empty(vm.board_back, vm.board_front, BAD_NEUTRAL, BAD, NEUTRAL);
        fill_empty(vm.board_back, vm.board_front, BAD_GOOD, BAD, GOOD);
        fill_empty(vm.board_back, vm.board_front, GOOD_BAD, GOOD, BAD);
        fill_empty(vm.board_back, vm.board_front, GOOD_GOOD, GOOD, GOOD);
        fill_empty(vm.board_back, vm.board_front, GOOD_NEUTRAL, GOOD, NEUTRAL);

        var words = _(vm.wordlists).chain().filter(function(v,k) {return vm.active_lists[k]}).flatten().value();
        if (words.length > vm.row_count * vm.col_count) {
            _.times(vm.row_count, function(x) {
                _.times(vm.col_count, function(y) {
                    var card_index = getRandomInt(0, words.length);
                    var card = words.splice(card_index, 1)[0];
                    var side = getRandomInt(0, card.length);
                    vm.board_front[x][y].word = _.cloneDeep(card[side]);
                    vm.board_back[x][y].word = _.cloneDeep(card[side]);
                });
            });
            // vm.words = _.times(vm.row_count * vm.col_count, function() {
            //     var card_index = getRandomInt(0, words.length);
            //     var card = words.splice(card_index, 1)[0];
            //     var side = getRandomInt(0, card.length);
            //     return card[side];
            // });
            // console.log(vm.words);
        }
    }
}

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
            if (board[x][y].class.indexOf('default') > -1 && board_flip[x][y].class == flip_tile.class) {
                board[x][y] = _.cloneDeep(tile);
                empty_tile = true;
            }
        }
    });
}