### Regras da aplicação

[X] - A aplicação deve ter dois tipos de usuário, entregador e/ou admin
[X] - Deve ser possível realizar login com CPF e Senha
[X] - Deve ser possível realizar o CRUD dos entregadores
[X] - Deve ser possível realizar o CRUD das encomendas
[X] - Deve ser possível realizar o CRUD dos destinatários
[X] - Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
[X] - Deve ser possível retirar uma encomenda
[X] - Deve ser possível marcar uma encomenda como entregue
[X] - Deve ser possível marcar uma encomenda como devolvida
[X] - Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
[X] - Deve ser possível alterar a senha de um usuário
[X] - Deve ser possível listar as entregas de um usuário
[X] - Deve ser possível notificar o destinatário a cada alteração no status da encomenda

### Regras de negócio

[ ] - Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
[ ] - Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
[ ] - Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
[X] - Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
[X] - Somente o entregador que retirou a encomenda pode marcar ela como entregue
[ ] - Somente o admin pode alterar a senha de um usuário
[ ] - Não deve ser possível um entregador listar as encomendas de outro entregador