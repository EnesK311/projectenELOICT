<?php

require_once('../vendor/autoload.php');
$router = new \Bramus\Router\Router();

$router->setNamespace('\Http');

// add your routes and run!

// added this to allow options requests, as per: https://github.com/bramus/router/pull/103

$router->get('/', 'MyController@allUsers'); //works!

$router->mount('/api', function () use ($router) {
    $router->options('/.*', function () {
        header('Access-Control-Allow-Origin: ' . ALLOW_ORIGIN);
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE');
        header('Access-Control-Allow-Headers: Content-Type, X-Authorization');
        header('Access-Control-Allow-Credentials: true');
    });

    $router->get('/allusers', 'UserController@allUsers'); // works
    $router->get('/users/(\d+)', 'UserController@oneUser'); //works
    $router->post('/users/test', 'UserController@test'); //test
    $router->post('/register', 'UserController@createUser'); //should work
    $router->post('/login', 'UserController@login'); // does not work generated code
    $router->post('/logout', 'UserController@logout'); //does not work generated code
    $router->post('/refresh-token', 'UserController@refreshToken');


    //add error code when no listings
    $router->post('/listings', 'ListingController@getListingsByIds'); //works
    $router->post('/listings/test', 'ListingController@testListings'); //test

    $router->get('/user', 'UserController@getRolesFromDatabase');

    //listings
    $router->get('/listings/(\d+)', 'ListingController@listingsId'); //works
    $router->get('/listings/immo/(\d+)', 'ListingController@listingsImmo'); //works
    $router->get('/listings/user/(\d+)', 'ListingController@listingsUser'); //works

    $router->get('/listings/immo', 'ListingController@getAllListingsImmo'); // should work
    $router->get('/listings/immo', 'ListingController@getAllLandImmo'); // should work

    $router->post('/listings/properties', 'ListingController@addProperty'); //works
    $router->get('/listings/properties', 'ListingController@getAllProperties'); //works
    $router->get('/listings/properties/(\d+)', 'ListingController@getPropertyById'); //works
    $router->post('/listings/land', 'ListingController@addLand'); //made but not checked yet
    $router->get('/listings/land', 'ListingController@getAllLand'); //made but not checked yet
    $router->get('/listings/land/(\d+)', 'ListingController@getLandById'); //made but not checked yet
    $router->post('/listings/favorite', 'ListingController@addFavorite'); //made but not checked yet
    $router->get('/listings/favorite', 'ListingController@getAllFavorites'); //made but not checked yet
    $router->delete('/listings/favorite', 'ListingController@removeFavorite'); //made but not checked yet

    $router->patch('/listings/(\d+)', 'ListingController@editListing'); //not done
    $router->delete('/listings/(\d+)', 'ListingController@deleteListing'); //not done

    //Immos
    $router->get('/immos', 'ImmoController@allImmos'); //works
    $router->get('/immos/(\d+)', 'ImmoController@immoId'); //works
    $router->post('/immos/invite', 'ImmoController@invite'); //needs to be created
    //een lijst geven aan admin met alle niet gekeurde immos
    $router->get('/immos/nietgekeurd', 'ImmoController@nietGekeurdeImmos'); //works
    $router->post('/immos', 'ImmoController@addImmo'); //works
    $router->patch('/immos/(\d+)', 'ImmoController@editImmo'); //moet aangepassen worden heeft momenteel zelfde code als add
    $router->delete('/immos/(\d+)', 'ImmoController@deleteImmo'); //werkt

    $router->patch('/immos/keuren/(\d+)', 'ImmoController@keurImmo'); // werkt
    //pauzeer activeer immo
    $router->patch('/immos/pauzeer/(\d+)', 'ImmoController@pauzeerImmo'); // werkt
    $router->patch('/immos/activeer/(\d+)', 'ImmoController@resumeImmo'); // werkt




}); //mount

$router->run();