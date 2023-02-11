
# app

- try catch global
- criar service de LeagueHttpService para fazer as chamadas a api da riot
- capturar error da api da riot

# /riot/recent-matches

- verificar se regionName(BR1, NA...) eh compativel as regioes(AMERICAS, ASIA...) disponiveis
- verificar se query params obrigatórios são passados
- desenvolver mapper
- desenvolver serializer
- mudar o nome de mapper para serializer

# /riot/leaderboards 


# builderurl service

- construir url de forma dinamica de acordo com a rota da riot


# cache interceptor

- metodos save e clear
- clear a cada X tempo ?
- criar service de cache para verificar se há X tempo já foi feita uma req (interceptor)
- salvar no cache a resposta da requisição caso o cache do summonerName e regionName esteja vazio (recent-matches)




clientRequest {summonerName: 'x', regionName: 'y'} -> Interceptor tem cache ? Cache : Service