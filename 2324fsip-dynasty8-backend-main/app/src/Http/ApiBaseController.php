<?php

namespace Http;

use Firebase\JWT\JWT;
use Firebase\JWT\BeforeValidException;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use Services\JWTService;

abstract class ApiBaseController
{
    protected ?array $httpBody;

    public function __construct()
    {
        // Parse the HTTP request body assuming it contains plain JSON
        $this->httpBody = json_decode(file_get_contents('php://input'), true);

        // CORS: API response can be shared with javascript code from origin ALLOW_ORIGIN
        header('Access-Control-Allow-Origin: ' . ALLOW_ORIGIN);

        // set the Content-type header of the HTTP response to JSON
        header('Content-type: application/json; charset=UTF-8');
        header('Access-Control-Allow-Credentials: true');
    }

    protected function message(int $httpCode, string $message)
    {
        http_response_code($httpCode);
        $answer = ['message' => $message];
        echo json_encode($answer);
    }

    public function methodNotAllowed()
    {
        $this->message(405, 'HTTP request method ' . $_SERVER['REQUEST_METHOD'] . ' not allowed.');
    }

    public function notFound()
    {
        $this->message(404, 'HTTP request method ' . $_SERVER['REQUEST_METHOD'] . ' not found.');
    }

    public function unauthorized()
    {
        $this->message(401, 'HTTP request method ' . $_SERVER['REQUEST_METHOD'] . ' unauthorized.');
    }

    public function forbidden()
    {
        $this->message(403, 'HTTP request method ' . $_SERVER['REQUEST_METHOD'] . ' forbidden.');
    }

    public function badRequest()
    {
        $this->message(400, 'HTTP request method ' . $_SERVER['REQUEST_METHOD'] . ' bad request.');
    }




}