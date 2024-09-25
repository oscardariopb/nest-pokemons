<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar

```
yarn install
```

3. Tener Nest Cli instalado

```
npm i -g @nestjs/cli
```

4. levantar la base de datos

```
docker-compose up -d
```

5. Cloar el archivo **.env.template** y renonmbrar la copia a `.env`

6. LLenar las variables de entorno definidas en `.env`

7. Ejercutar la app en dev

```
yarn start:dev
```

8. Reconstruir db con semilla en dev

```
localhost:3000/api/v2/seed
```

## stack usado

- MongoDB
- Nest
