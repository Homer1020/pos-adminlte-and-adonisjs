# POS System by Homer Moncayo

## Development Setup
1. Install dependencies
```
npm i
```
2. Create .env file
```
cp .env.example .env
```
3. Set database enviroments into .env
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=almacen_adonis
```
4. Run migrations and seed the database
```
node ace migration:run --seed
```
5. Start the project in dev mode
```
npm run dev
```
## Generate build for production
```
npm run build
```