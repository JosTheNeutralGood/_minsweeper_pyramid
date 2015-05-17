from pyramid.view import view_config

@view_config(route_name='home', renderer='templates/homescreen.pt')
def home_screen(request):
  host = request.host
  return {'b_url': '/beginner_game', 'i_url': '/intermediate_game', 'e_url': '/expert_game'}

@view_config(route_name='board', renderer='templates/board.pt')
def board_view(request):
  return_hash = request.matchdict
  difficulty = return_hash['difficulty']
  if difficulty == 'beginner':
    height = 9
    width = 9
    mines = 10
  elif difficulty == 'intermediate':
    height = 16
    width = 16
    mines = 40
  elif difficulty == 'expert':
    height = 16
    width = 31
    mines = 99
  return_hash['board'] = init_board(width,height,mines)
  

@view_config(route_name='otherhome', renderer='templates/mytemplate.pt')
def my_view(request):
    return {'project': 'minesweep'}

def init_board(w, h, m):
  board = blank_board(w, h)
  for x in range(0, m):
    mine = unique_mine(board, w, h)
    board[mine[x]][mine[y]] = 'm'
    mine_top = (mine[y] == 0)
    mine_left = (mine[x] == 0)
    mine_right = (mine[x] == w-1)
    mine_bottom = (mine[y] == h-1)
    #incrementing upper left
    if not mine_top and not mine_left and board[mine[x]-1][mine[y]-1] != 'm':
      board[mine[x]-1][mine[y]-1] = board[mine[x]-1][mine[y]-1] + 1
    #incrementing above
    if not mine_top and board[mine[x]][mine[y]-1] != 'm':
      board[mine[x]][mine[y]-1] = board[mine[x]][mine[y]-1] + 1
    #incrementing upper right
    if not mine_top and not mine_right and board[mine[x]+1][mine[y]-1] != 'm':
      board[mine[x]+1][mine[y]-1] = board[mine[x]+1][mine[y]-1] + 1
    #incrementing right
    if not mine_right and board[mine[x]+1][mine[y]] != 'm':
      board[mine[x]+1][mine[y]] = board[mine[x]+1][mine[y]] + 1
    #incrementing bottom right
    if not mine_bottom and not mine_right and board[mine[x]+1][mine[y]+1] != 'm':
      board[mine[x]+1][mine[y]+1] = board[mine[x]+1][mine[y]+1] + 1
    #incrementing bellow
    if not mine_bottom and board[mine[x]][mine[y]+1] != 'm':
      board[mine[x]][mine[y]+1] = board[mine[x]][mine[y]+1] + 1
     #incrementing bottom left
    if not mine_bottom and not mine_left and board[mine[x]-1][mine[y]+1] != 'm':
      board[mine[x]-1][mine[y]+1] = board[mine[x]-1][mine[y]+1] + 1
    #incrementing left
    if not mine_left and board[mine[x]-1][mine[y]] != 'm':
      board[mine[x]-1][mine[y]] = board[mine[x]-1][mine[y]] + 1
  return board
  
def unique_mine(board, w, h):
  x = randint(0, w)
  y = randint(0, h)
  
  if board[x][y] != 'm':
    return {'x': x, 'y': y}
  else:
    return unique_mine(board, w, h)
    
def blank_board(w, h):
  #returns w by h board filled with 0's meaning 0 mines around this spot
  board = []
  row = []
  for y in range(0, h):
    row.append(0)
  for x in range(0, w):
    board.append(row)
    