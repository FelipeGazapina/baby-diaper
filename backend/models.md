# Modelos de Dados para o Strapi

## Modelo: Baby (Bebê)

```
{
  "kind": "collectionType",
  "collectionName": "babies",
  "info": {
    "singularName": "baby",
    "pluralName": "babies",
    "displayName": "Bebê"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "birthDate": {
      "type": "date",
      "required": true
    },
    "gender": {
      "type": "enumeration",
      "enum": [
        "male",
        "female"
      ],
      "required": true
    },
    "measurements": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::measurement.measurement",
      "mappedBy": "baby"
    },
    "diaperUsages": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::diaper-usage.diaper-usage",
      "mappedBy": "baby"
    },
    "predictions": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::prediction.prediction",
      "mappedBy": "baby"
    }
  }
}
```

## Modelo: Measurement (Medidas)

```
{
  "kind": "collectionType",
  "collectionName": "measurements",
  "info": {
    "singularName": "measurement",
    "pluralName": "measurements",
    "displayName": "Medidas"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "date": {
      "type": "date",
      "required": true
    },
    "weight": {
      "type": "decimal",
      "required": true
    },
    "height": {
      "type": "decimal",
      "required": true
    },
    "baby": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::baby.baby",
      "inversedBy": "measurements"
    }
  }
}
```

## Modelo: DiaperUsage (Uso de Fraldas)

```
{
  "kind": "collectionType",
  "collectionName": "diaper_usages",
  "info": {
    "singularName": "diaper-usage",
    "pluralName": "diaper-usages",
    "displayName": "Uso de Fraldas"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "date": {
      "type": "date",
      "required": true
    },
    "quantity": {
      "type": "integer",
      "required": true,
      "min": 1
    },
    "size": {
      "type": "enumeration",
      "enum": [
        "RN",
        "P",
        "M",
        "G",
        "XG",
        "XXG"
      ],
      "required": true
    },
    "baby": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::baby.baby",
      "inversedBy": "diaperUsages"
    }
  }
}
```

## Modelo: Prediction (Previsão)

```
{
  "kind": "collectionType",
  "collectionName": "predictions",
  "info": {
    "singularName": "prediction",
    "pluralName": "predictions",
    "displayName": "Previsão"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "startDate": {
      "type": "date",
      "required": true
    },
    "endDate": {
      "type": "date",
      "required": true
    },
    "estimatedQuantity": {
      "type": "integer",
      "required": true
    },
    "estimatedSize": {
      "type": "enumeration",
      "enum": [
        "RN",
        "P",
        "M",
        "G",
        "XG",
        "XXG"
      ],
      "required": true
    },
    "baby": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::baby.baby",
      "inversedBy": "predictions"
    }
  }
}
``` 