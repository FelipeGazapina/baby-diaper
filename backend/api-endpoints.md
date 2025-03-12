# Endpoints da API

## Bebês

### GET /api/babies
Retorna a lista de todos os bebês cadastrados.

### GET /api/babies/:id
Retorna os detalhes de um bebê específico.

### POST /api/babies
Cria um novo registro de bebê.

Exemplo de payload:
```json
{
  "data": {
    "name": "João",
    "birthDate": "2023-01-15",
    "gender": "male"
  }
}
```

### PUT /api/babies/:id
Atualiza os dados de um bebê existente.

### DELETE /api/babies/:id
Remove um bebê do sistema.

## Medidas

### GET /api/measurements
Retorna todas as medidas registradas.

### GET /api/measurements/:id
Retorna os detalhes de uma medida específica.

### POST /api/measurements
Registra uma nova medida.

Exemplo de payload:
```json
{
  "data": {
    "date": "2023-02-15",
    "weight": 4.5,
    "height": 55.2,
    "baby": 1
  }
}
```

### PUT /api/measurements/:id
Atualiza uma medida existente.

### DELETE /api/measurements/:id
Remove uma medida do sistema.

## Uso de Fraldas

### GET /api/diaper-usages
Retorna todos os registros de uso de fraldas.

### GET /api/diaper-usages/:id
Retorna os detalhes de um registro específico de uso de fraldas.

### POST /api/diaper-usages
Registra um novo uso de fraldas.

Exemplo de payload:
```json
{
  "data": {
    "date": "2023-02-15",
    "quantity": 8,
    "size": "P",
    "baby": 1
  }
}
```

### PUT /api/diaper-usages/:id
Atualiza um registro existente de uso de fraldas.

### DELETE /api/diaper-usages/:id
Remove um registro de uso de fraldas.

## Previsões

### GET /api/predictions
Retorna todas as previsões geradas.

### GET /api/predictions/:id
Retorna os detalhes de uma previsão específica.

### POST /api/predictions
Gera uma nova previsão.

Exemplo de payload:
```json
{
  "data": {
    "baby": 1,
    "daysToPredict": 30
  }
}
```

### PUT /api/predictions/:id
Atualiza uma previsão existente.

### DELETE /api/predictions/:id
Remove uma previsão do sistema.

## Endpoints Personalizados

### POST /api/generate-prediction
Endpoint personalizado para gerar uma previsão com base nos dados históricos.

Exemplo de payload:
```json
{
  "babyId": 1,
  "daysToPredict": 30
}
```

Exemplo de resposta:
```json
{
  "startDate": "2023-02-15T00:00:00.000Z",
  "endDate": "2023-03-17T00:00:00.000Z",
  "estimatedQuantity": 240,
  "estimatedSize": "M",
  "baby": 1
}
```

### GET /api/diaper-usage-stats/:babyId
Retorna estatísticas de uso de fraldas para um bebê específico.

Exemplo de resposta:
```json
{
  "dailyAverage": 8,
  "weeklyAverage": 56,
  "monthlyAverage": 240,
  "currentSize": "P",
  "nextSizeEstimation": {
    "size": "M",
    "estimatedDate": "2023-03-15T00:00:00.000Z"
  }
}
``` 