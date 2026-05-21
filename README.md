# API Menu

API para gestão de menus de um site corporativo com suporte a aninhamento infinito de itens e sub-itens.

## Tecnologias

- Node.js + TypeScript
- Express
- MongoDB + Mongoose

## Arquitetura (DDD)

O projeto segue Domain-Driven Design com separação em 4 camadas:

```
src/
├── domain/           # Camada de Domínio
│   ├── entities/     # Entidades e interfaces do negócio
│   └── repositories/ # Contratos (interfaces) dos repositórios
├── application/      # Camada de Aplicação
│   └── usecases/     # Casos de uso (orquestração da lógica)
├── infrastructure/   # Camada de Infraestrutura
│   ├── database/     # Modelos e schemas do banco (Mongoose)
│   └── repositories/ # Implementação concreta dos repositórios
└── interfaces/       # Camada de Interface (Adaptadores)
    ├── controllers/  # Controllers HTTP
    ├── dtos/         # Data Transfer Objects (validação e contratos)
    └── routes/       # Definição das rotas Express
```

- **Domain**: contém a entidade `MenuItem` e a interface do repositório. Não depende de nenhuma outra camada.
- **Application**: contém os use cases (`CreateMenuItem`, `DeleteMenuItem`, `GetMenu`). Depende apenas do domínio.
- **Infrastructure**: implementa os contratos do domínio usando MongoDB/Mongoose.
- **Interfaces**: adapta requisições HTTP para os use cases e formata as respostas.

## Variáveis de Ambiente

| Variável    | Descrição                  | Default                             |
|-------------|----------------------------|-------------------------------------|
| `PORT`      | Porta do servidor          | `3000`                              |
| `MONGO_URI` | URI de conexão ao MongoDB  | `mongodb://localhost:27017/api-menu` |

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

## Como Rodar

### Com Docker (MongoDB)

```bash
docker compose up -d
npm install
npm run dev
```

### Sem Docker (MongoDB externo)

Basta configurar a variável `MONGO_URI` no `.env` apontando para sua instância MongoDB:

```bash
npm install
npm run dev
```

## Endpoints

### Criar item

```
POST /api/v1/menu
```

Body:
```json
{
  "name": "Eletrodomésticos",
  "relatedId": "id_do_pai (opcional)"
}
```

Response `201`:
```json
{
  "id": "id_do_item_criado"
}
```

### Excluir item

```
DELETE /api/v1/menu/:id
```

Response `200`:
```json
{
  "message": "Item deleted"
}
```

> Remove o item e todos os seus sub-itens recursivamente.

### Consultar menu

```
GET /api/v1/menu
```

Response `200`:
```json
[
  {
    "id": "1",
    "name": "Eletrodomésticos",
    "submenus": [
      {
        "id": "2",
        "name": "Televisores",
        "submenus": [...]
      }
    ]
  }
]
```

## Scripts

| Comando         | Descrição                        |
|-----------------|----------------------------------|
| `npm run dev`   | Roda em modo desenvolvimento     |
| `npm run build` | Compila TypeScript para `dist/`  |
| `npm start`     | Roda a versão compilada          |
