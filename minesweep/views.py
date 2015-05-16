from pyramid.view import view_config

@view_config(route_name='home', renderer='templates/homescreen.pt')
def homescreen(request):
  host = request.host
  return {'b_url': host + '/beginner_game',
          'i_url': host + '/intermediate_game',
          'e_url': host + '/expert_game'}

@view_config(route_name='board', renderer='templates/board.pt')
  if difficulty == 'beginner':
    height = 
  for x in range(0, 3):

@view_config(route_name='home', renderer='templates/mytemplate.pt')
def my_view(request):
    return {'project': 'minesweep'}

