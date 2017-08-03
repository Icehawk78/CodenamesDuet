require 'digest/md5'

WIDTH = 5
HEIGHT = 5
GOOD_TILES = 9
BAD_TILES = 3
BAD_BAD = 1
BAD_GOOD = 1
GOOD_GOOD = 3
GOOD_SYMBOL = '✔️'
NEUTRAL_SYMBOL = '⛔'
BAD_SYMBOL = '⚠'

def display_board board
  puts ""
  board.each{|row|
    row.each{|cell|
      print (cell == 1 ? GOOD_SYMBOL : (cell == -1 ? BAD_SYMBOL : NEUTRAL_SYMBOL))
    }
    print "\n"
  }
  puts ""
end

#print 'Seed: '
seed = (ARGV[0] or gets.chomp)

randomize = Random.new(Digest::MD5.hexdigest(seed).to_i(16))

board_front = Array.new(WIDTH) {|row|
  row = Array.new(HEIGHT)
}

board_back = Array.new(WIDTH) {|row|
  row = Array.new(HEIGHT)
}

GOOD_TILES.times {
  empty_tile = false
  until empty_tile
    # display_board(board_front)
    x = randomize.rand(WIDTH)
    y = randomize.rand(HEIGHT)
    if board_front[x][y].nil?
      # puts "#{x}, #{y}: #{board_front[x][y]}"
      board_front[x][y] = 1
      empty_tile = true
    end
  end
}

BAD_TILES.times {
  empty_tile = false
  until empty_tile
    x = randomize.rand(WIDTH)
    y = randomize.rand(HEIGHT)
    if board_front[x][y].nil?
      board_front[x][y] = -1
      empty_tile = true
    end
  end
}

bad_bad_count = 0
bad_good_count = 0
good_good_count = 0
good_bad_count = 0

GOOD_TILES.times {
  empty_tile = false
  until empty_tile
    x = randomize.rand(WIDTH)
    y = randomize.rand(HEIGHT)
    if board_back[x][y].nil?
      front_tile = board_front[x][y]
      if front_tile == 1 and good_good_count < GOOD_GOOD
        board_back[x][y] = 1
        good_good_count += 1
        empty_tile = true
      end
      if front_tile == -1 and good_bad_count < BAD_GOOD
        board_back[x][y] = 1
        good_bad_count += 1
        empty_tile = true
      end
      if front_tile.nil? and good_good_count == GOOD_GOOD and good_bad_count == BAD_GOOD
        board_back[x][y] = 1
        empty_tile = true
      end
    end
  end
}

BAD_TILES.times {
  empty_tile = false
  until empty_tile
    x = randomize.rand(WIDTH)
    y = randomize.rand(HEIGHT)
    if board_back[x][y].nil?
      front_tile = board_front[x][y]
      if front_tile == 1 and bad_good_count < BAD_GOOD
        board_back[x][y] = -1
        bad_good_count += 1
        empty_tile = true
      end
      if front_tile == -1 and bad_bad_count < BAD_BAD
        board_back[x][y] = -1
        bad_bad_count += 1
        empty_tile = true
      end
      if front_tile.nil? and bad_bad_count == BAD_BAD and bad_good_count == BAD_GOOD
        board_back[x][y] = -1
        empty_tile = true
      end
    end
  end
}

puts 'Front: '
display_board(board_front)

puts 'Back: '
display_board(board_back)