# Casos de Uso

## UC01: Cadastrar Bebê

**Ator Principal**: Usuário (Pai/Mãe)

**Pré-condições**: Usuário está autenticado no sistema

**Fluxo Principal**:
1. Usuário seleciona a opção "Cadastrar Bebê"
2. Sistema exibe formulário de cadastro
3. Usuário preenche nome, data de nascimento e sexo do bebê
4. Usuário opcionalmente adiciona uma foto
5. Usuário confirma o cadastro
6. Sistema valida os dados
7. Sistema registra o bebê e exibe mensagem de sucesso

**Fluxos Alternativos**:
- Se os dados forem inválidos, o sistema exibe mensagem de erro e solicita correção
- Usuário pode cancelar o cadastro a qualquer momento

## UC02: Registrar Uso Diário de Fraldas

**Ator Principal**: Usuário (Pai/Mãe)

**Pré-condições**: Usuário está autenticado e possui pelo menos um bebê cadastrado

**Fluxo Principal**:
1. Usuário seleciona a opção "Registrar Uso"
2. Sistema exibe formulário de registro
3. Usuário seleciona o bebê (se houver mais de um)
4. Usuário seleciona a data (padrão: hoje)
5. Usuário informa a quantidade de fraldas usadas
6. Usuário seleciona o tamanho da fralda
7. Usuário confirma o registro
8. Sistema valida os dados
9. Sistema registra o uso e exibe mensagem de sucesso

**Fluxos Alternativos**:
- Se os dados forem inválidos, o sistema exibe mensagem de erro e solicita correção
- Usuário pode cancelar o registro a qualquer momento

## UC03: Registrar Medidas do Bebê

**Ator Principal**: Usuário (Pai/Mãe)

**Pré-condições**: Usuário está autenticado e possui pelo menos um bebê cadastrado

**Fluxo Principal**:
1. Usuário seleciona a opção "Registrar Medidas"
2. Sistema exibe formulário de registro
3. Usuário seleciona o bebê (se houver mais de um)
4. Usuário seleciona a data (padrão: hoje)
5. Usuário informa o peso do bebê
6. Usuário informa a altura do bebê
7. Usuário confirma o registro
8. Sistema valida os dados
9. Sistema registra as medidas e exibe mensagem de sucesso

**Fluxos Alternativos**:
- Se os dados forem inválidos, o sistema exibe mensagem de erro e solicita correção
- Usuário pode cancelar o registro a qualquer momento

## UC04: Visualizar Dashboard

**Ator Principal**: Usuário (Pai/Mãe)

**Pré-condições**: Usuário está autenticado e possui pelo menos um bebê cadastrado

**Fluxo Principal**:
1. Usuário acessa a tela inicial do aplicativo
2. Sistema exibe o dashboard com:
   - Resumo do uso diário de fraldas
   - Gráfico de uso semanal
   - Informações do bebê
   - Tamanho atual da fralda
   - Alertas de mudança de tamanho
   - Quantidade estimada para o próximo mês

**Fluxos Alternativos**:
- Se houver mais de um bebê, o usuário pode alternar entre eles
- Se não houver dados suficientes para algumas estatísticas, o sistema exibe mensagem informativa

## UC05: Gerar Previsão de Uso

**Ator Principal**: Usuário (Pai/Mãe)

**Pré-condições**: Usuário está autenticado e possui pelo menos um bebê cadastrado com histórico de uso e medidas

**Fluxo Principal**:
1. Usuário seleciona a opção "Previsões"
2. Sistema exibe tela de previsões
3. Usuário seleciona o bebê (se houver mais de um)
4. Usuário seleciona o período (7, 30 ou 90 dias)
5. Sistema calcula e exibe:
   - Quantidade estimada de fraldas
   - Tamanho estimado da fralda
   - Gráfico de projeção
   - Informações sobre próxima mudança de tamanho

**Fluxos Alternativos**:
- Se não houver dados suficientes para gerar previsões, o sistema exibe mensagem informativa
- Usuário pode alternar entre diferentes períodos de previsão

## UC06: Visualizar Histórico de Uso

**Ator Principal**: Usuário (Pai/Mãe)

**Pré-condições**: Usuário está autenticado e possui pelo menos um bebê cadastrado com histórico de uso

**Fluxo Principal**:
1. Usuário seleciona a opção "Histórico"
2. Sistema exibe tela de histórico
3. Usuário seleciona o bebê (se houver mais de um)
4. Usuário seleciona o período (dia, semana, mês)
5. Sistema exibe:
   - Lista de registros de uso
   - Gráfico de uso ao longo do tempo
   - Estatísticas do período selecionado

**Fluxos Alternativos**:
- Usuário pode filtrar por tamanho de fralda
- Usuário pode editar ou excluir registros
- Se não houver registros no período selecionado, o sistema exibe mensagem informativa

## UC07: Configurar Notificações

**Ator Principal**: Usuário (Pai/Mãe)

**Pré-condições**: Usuário está autenticado

**Fluxo Principal**:
1. Usuário seleciona a opção "Configurações"
2. Usuário seleciona "Notificações"
3. Sistema exibe opções de notificação:
   - Lembretes para registro diário
   - Alertas de estoque baixo
   - Notificações de mudança de tamanho
   - Lembretes para atualizar medidas
4. Usuário configura as notificações desejadas
5. Usuário confirma as configurações
6. Sistema salva as preferências

**Fluxos Alternativos**:
- Usuário pode desativar todas as notificações
- Usuário pode restaurar configurações padrão

## UC08: Exportar Dados

**Ator Principal**: Usuário (Pai/Mãe)

**Pré-condições**: Usuário está autenticado e possui pelo menos um bebê cadastrado com histórico

**Fluxo Principal**:
1. Usuário seleciona a opção "Exportar Dados"
2. Sistema exibe opções de exportação:
   - Formato (CSV, PDF)
   - Período
   - Tipo de dados (uso de fraldas, medidas, previsões)
3. Usuário seleciona as opções desejadas
4. Usuário confirma a exportação
5. Sistema gera o arquivo
6. Sistema disponibiliza o arquivo para download ou compartilhamento

**Fluxos Alternativos**:
- Se ocorrer erro na geração do arquivo, o sistema exibe mensagem de erro
- Usuário pode cancelar a exportação a qualquer momento 