# Design da Interface do Usuário

## Paleta de Cores

- **Cor Primária**: #4A90E2 (Azul)
- **Cor Secundária**: #F5A623 (Amarelo)
- **Cor de Destaque**: #7ED321 (Verde)
- **Cor de Alerta**: #D0021B (Vermelho)
- **Cor de Fundo**: #F8F8F8 (Cinza claro)
- **Cor de Texto**: #333333 (Cinza escuro)

## Tipografia

- **Fonte Principal**: Roboto
- **Títulos**: Roboto Bold
- **Corpo de Texto**: Roboto Regular
- **Destaques**: Roboto Medium

## Componentes de UI

### Botões

- **Botão Primário**: Retangular com cantos arredondados, cor primária, texto branco
- **Botão Secundário**: Contorno da cor primária, fundo transparente, texto da cor primária
- **Botão de Ação Flutuante**: Circular, cor de destaque, ícone branco

### Campos de Entrada

- **Campo de Texto**: Contorno fino, preenchimento leve quando focado
- **Seletor de Data**: Calendário pop-up com destaque para a data atual
- **Seletor Numérico**: Controles de incremento/decremento para valores numéricos

### Cartões

- **Cartão de Informação**: Fundo branco, sombra suave, cantos arredondados
- **Cartão de Estatística**: Inclui valor numérico grande e descrição
- **Cartão de Alerta**: Borda colorida baseada na severidade

### Gráficos

- **Gráfico de Linha**: Para mostrar tendências ao longo do tempo
- **Gráfico de Barras**: Para comparar valores entre períodos
- **Gráfico de Pizza**: Para mostrar distribuição de tamanhos de fraldas

## Layouts de Tela

### Tela Inicial (Dashboard)

```
+----------------------------------+
|  [Logo]       [Perfil]  [Config] |
+----------------------------------+
|                                  |
|  Olá, [Nome do Usuário]!         |
|                                  |
+----------------------------------+
|                                  |
|  [Cartão de Resumo Diário]       |
|  - Fraldas usadas hoje: X        |
|  - Tamanho atual: Y              |
|                                  |
+----------------------------------+
|                                  |
|  [Gráfico de Uso Semanal]        |
|                                  |
|                                  |
+----------------------------------+
|                                  |
|  [Cartão de Previsão]            |
|  - Próximos 7 dias: X fraldas    |
|  - Próxima mudança: em Y dias    |
|                                  |
+----------------------------------+
|                                  |
| [Registrar] [Histórico] [Prever] |
|                                  |
+----------------------------------+
```

### Tela de Registro de Uso

```
+----------------------------------+
|  [Voltar]  Registrar Uso  [Info] |
+----------------------------------+
|                                  |
|  Data: [Seletor de Data]         |
|                                  |
|  Quantidade: [Seletor Numérico]  |
|                                  |
|  Tamanho:                        |
|  [RN] [P] [M] [G] [XG] [XXG]     |
|                                  |
|                                  |
|  [Botão Salvar]                  |
|                                  |
+----------------------------------+
|                                  |
|  Registros Recentes:             |
|  - Ontem: X fraldas              |
|  - Anteontem: Y fraldas          |
|                                  |
+----------------------------------+
```

### Tela de Previsões

```
+----------------------------------+
|  [Voltar]    Previsões    [Info] |
+----------------------------------+
|                                  |
|  [Tabs: 7 dias | 30 dias | 90 dias] |
|                                  |
+----------------------------------+
|                                  |
|  Quantidade Estimada: X fraldas  |
|                                  |
|  Tamanho Estimado: Y             |
|                                  |
|  [Gráfico de Projeção]           |
|                                  |
|                                  |
+----------------------------------+
|                                  |
|  Próxima Mudança de Tamanho:     |
|  - Tamanho: Z                    |
|  - Data Estimada: DD/MM/AAAA     |
|                                  |
+----------------------------------+
```

## Elementos de Navegação

### Barra Inferior

- **Ícone Home**: Acesso à tela inicial
- **Ícone Registrar**: Acesso rápido ao registro de uso
- **Ícone Histórico**: Acesso ao histórico de registros
- **Ícone Estatísticas**: Acesso às estatísticas e previsões
- **Ícone Perfil**: Acesso às configurações e perfil do bebê

### Menu Lateral

- **Perfil do Bebê**: Foto e informações básicas
- **Dashboard**: Tela inicial
- **Registrar Uso**: Registro de uso de fraldas
- **Registrar Medidas**: Registro de peso e altura
- **Histórico**: Visualização de registros passados
- **Estatísticas**: Visualização de estatísticas
- **Previsões**: Visualização de previsões
- **Configurações**: Ajustes do aplicativo
- **Ajuda**: Acesso à documentação e suporte
- **Sair**: Logout do aplicativo

## Animações e Transições

- **Transição entre Telas**: Deslizamento suave
- **Carregamento de Dados**: Indicador de progresso circular
- **Atualização de Gráficos**: Animação de crescimento
- **Feedback de Botões**: Efeito de ondulação ao tocar

## Responsividade

- **Smartphones**: Layout otimizado para telas pequenas
- **Tablets**: Layout expandido com mais informações visíveis
- **Orientação**: Suporte para modos retrato e paisagem 