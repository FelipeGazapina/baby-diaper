# Rastreador de Fraldas para Bebê

Um aplicativo para rastrear o uso de fraldas do seu bebê e prever necessidades futuras com base no histórico de uso e crescimento.

## Funcionalidades

- Registro diário de uso de fraldas
- Acompanhamento do crescimento do bebê (peso e altura)
- Previsão de necessidades futuras de fraldas
- Alertas para mudança de tamanho
- Estatísticas de uso
- Funciona offline (PWA)

## Tecnologias Utilizadas

### Backend
- Strapi (Headless CMS)
- PostgreSQL (Banco de dados)
- Docker e Docker Compose (Containerização)

### Frontend
- React (Framework JavaScript)
- PWA (Progressive Web App)
- IndexedDB (Armazenamento offline)
- Service Workers (Sincronização em background)

## Pré-requisitos

- Node.js (v16 ou superior)
- Docker e Docker Compose
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/baby-diaper-tracker.git
cd baby-diaper-tracker
```

2. Inicie os containers do backend:
```bash
docker-compose up -d
```

3. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

4. Inicie o frontend:
```bash
npm start
```

5. Acesse o aplicativo em:
   - Frontend: http://localhost:3000
   - Backend (Strapi Admin): http://localhost:1337/admin

## Estrutura do Projeto

- `backend/`: API Strapi para gerenciar dados
- `frontend/`: Aplicativo React PWA para interação do usuário
- `docker-compose.yml`: Configuração dos containers Docker

## Modelos de Dados

### Bebê
- Nome
- Data de nascimento
- Sexo

### Medidas
- Data
- Peso
- Altura
- Referência ao bebê

### Uso de Fraldas
- Data
- Quantidade
- Tamanho
- Referência ao bebê

### Previsões
- Período
- Quantidade estimada
- Tamanho estimado
- Referência ao bebê

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

- Referência ao bebê #   b a b y - d i a p e r 
 
 #   b a b y - d i a p e r 
 
 #   b a b y - d i a p e r 
 
 