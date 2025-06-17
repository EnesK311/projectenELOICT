# php-boilerplate

PHP project folder structure for the courses _Back-end Development_ and _Full-stack: Introductory Project_, part of the Professional Bachelor ICT study program.

**main** branch: MySQL 8.0 | PhpMyAdmin | Apache + PHP 8.2 | libs: doctrine/dbal, twig/twig, bramus/router

**plesk-web-api** branch: MariaDB 10.6.12 | PhpMyAdmin | Apache + PHP 8.2 | libs: doctrine/dbal, bramus/router

## Links

- [Course slides](https://ikdoeict.gitlab.io/public/vakken/back-end-development/workshops/)
- [PHP Documentation](https://www.php.net/docs.php)
- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
- [Doctrine DBAL 3.7 documentation](https://www.doctrine-project.org/projects/doctrine-dbal/en/3.7/index.html)
- [Twig 3.x documentation](https://twig.symfony.com/doc/3.x/)
- [bramus/router documentation](https://github.com/bramus/router)

## Installing and developing your own project based on this boilerplate

1. Create a new completely! empty project (without README) on gitlab.com/ikdoeict, for example my-project
2. Execute following commands on your system (pay attention !)

```shell
mkdir my-project
cd my-project
git init
git pull https://gitlab.com/ikdoeict/public/vakken/back-end-development/php-boilerplate.git
git remote add origin https://gitlab.com/ikdoeict/<your-name>/my-project.git
git push -u origin main
```

3. From now on, you can stage, commit and push as usual.
4. Open the main folder with an IDE (such as PhpStorm or Visual Studio Code)

## Running and stopping the Docker MCE

- Run the environment, using Docker, from your terminal/cmd

```shell
cd <your-project>
docker-compose up
```

- Stop the environment in your terminal/cmd by pressing <code>Ctrl+C</code>
- In order to avoid conflicts with your lab/slides environment, run from your terminal/cmd

```shell
docker-compose down
```

## Installing Twig, DBAL and bramus/router

The MCE is provided with a `composer.json`/`composer.lock` file, providing the Twig and DBAL libraries

- In order to install, run from your terminal/cmd

```shell
docker-compose exec php-web bash
$ composer install
$ exit
```

## About the autoloader

`composer.json` is configured such that the classes in "src/" (and subfolders), and the files "config/database.php" and "config/app.php" are autoloaded.

- This means there is no need to require these classes anymore in your `public/*.php` scripts.
- You can extend this list yourself in `composer.json`
- When you changed this list, or you created some new classes, let composer know from your terminal/cmd:

```shell
docker-compose exec php-web bash
$ composer dump-autoload
$ exit
```

## Recipes and troubleshooting

### <code>docker-compose up</code> does not start one or more containers

- Look at the output of <code>docker-compose up</code>. When a container (fails and) exits, it is shown as the last line of the container output (colored tags by container)
- Alternatively, start another terminal/cmd and inspect the output of <code>docker-compose ps -a</code>. You can see which container exited, exactly when.
- Probably one of the containers fails because TCP/IP port 8000, 8080 or 3307 is already in use on your system. Stop the environment, change the port in <code>docker-compose.yml</code> en rerun <code>docker-compose up</code>.

## All routes that you can send requests to in the back end

## User Routes

- `GET /api/allusers`

  Get all users.

- `GET /api/users/(\d+)`

  Get details of a specific user.

- `POST /api/users/test`

  Test route for users.

- `POST /api/register`

  Create a new user.

- `POST /api/login`

  User login.

- `POST /api/logout`

  User logout.

- `POST /api/refresh-token`

  Refresh JWT token.

- `GET /api/user`

  Get user roles from the database.

## Listing Routes

- `POST /api/listings`

  Get listings by IDs.

- `POST /api/listings/test`

  Test route for listings.

- `GET /api/listings/(\d+)`

  Get details of a specific listing.

- `GET /api/listings/immo/(\d+)`

  Get listings by immo ID.

- `GET /api/listings/user/(\d+)`

  Get listings by user ID.

- `GET /api/listings/immo`

  Get all immo listings.

- `GET /api/listings/immo`

  Get all land listings.

- `POST /api/listings/properties`

  Add a property listing.

- `GET /api/listings/properties`

  Get all property listings.

- `GET /api/listings/properties/(\d+)`

  Get details of a specific property listing.

- `POST /api/listings/land`

  Add a land listing.

- `GET /api/listings/land`

  Get all land listings.

- `GET /api/listings/land/(\d+)`

  Get details of a specific land listing.

- `POST /api/listings/favorite`

  Add a listing to favorites.

- `GET /api/listings/favorite`

  Get all favorite listings.

- `DELETE /api/listings/favorite`

  Remove a listing from favorites.

- `PATCH /api/listings/(\d+)`

  Edit a listing.

- `DELETE /api/listings/(\d+)`

  Delete a listing.

## Immo Routes

- `GET /api/immos`

  Get all immos.

- `GET /api/immos/(\d+)`

  Get details of a specific immo.

- `POST /api/immos/invite`

  Invite to an immo (to be created).

- `GET /api/immos/nietgekeurd`

  Get all unapproved immos.

- `POST /api/immos`

  Add an immo.

- `PATCH /api/immos/(\d+)`

  Edit an immo (needs to be updated).

- `DELETE /api/immos/(\d+)`

  Delete an immo.

- `PATCH /api/immos/keuren/(\d+)`

  Approve an immo.

- `PATCH /api/immos/pauzeer/(\d+)`

  Pause an immo.

- `PATCH /api/immos/activeer/(\d+)`

  Resume an immo.
