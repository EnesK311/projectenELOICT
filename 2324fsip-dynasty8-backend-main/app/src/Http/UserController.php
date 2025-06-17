<?php

namespace Http;

use \Services\DatabaseConnector;
use Services\MailerService;
use \Services\JWTService;

use Exception;

class UserController extends ApiBaseController
{
    protected \Doctrine\DBAL\Connection $db;

    public function __construct()
    {
        parent::__construct();

        // initiate DB connection
        $this->db = DatabaseConnector::getConnection();
    }

    public function refreshToken() : void
    {
        $refreshToken = $_COOKIE['refreshToken'] ?? false;

        if ($refreshToken) {
            try {
                $decodedPayload = JWTService::validateJWTToken($refreshToken, SECRET_KEY);
                $userId = $decodedPayload->id;

                // verify & delete refresh token in database
                $stmt = $this->db->prepare('DELETE FROM refresh_tokens WHERE token = ? AND user_id = ?');
                $count = $stmt->executeStatement([$refreshToken, $userId]);

                if ($count > 0) { // the token was still in the table
                    // fetch user info from DB, it might have been changed
                    $user = $this->getUserFromDatabasebyId($userId);
                    $role = $user['role'];
                    $immo_id = $user['immo_id'];

                // generate refresh token and send as http-only cookie
                    $refreshToken = JWTService::generateJWTToken($user['id'], $user['username'], $role, null, SECRET_KEY, REFRESH_TOKEN_LIFETIME);
                    setcookie('refreshToken', $refreshToken, time() + REFRESH_TOKEN_LIFETIME, "", "", false, true);

                // add refresh token to the database
                    $stmt = $this->db->prepare('INSERT INTO refresh_tokens (token, user_id) VALUES (?, ?)');
                    $stmt->executeStatement([$refreshToken, $user['id']]);

                // generate access token and send in HTTP response body
                    $jwtToken = JWTService::generateJWTToken($user['id'], $user['username'], $role, $immo_id, SECRET_KEY, ACCESS_TOKEN_LIFETIME);
                    echo json_encode(['accessToken' => $jwtToken]);

                return; // return, won't do 401
            }

            } catch (Exception $e) {

            }
        }
        $this->message(401, 'Invalid credentials'); // 401 Unauthorized
        exit();
    }

    public function allUsers()
    {
        //alleen owner kan lijst krijgen van alle users
        $this->Authorize(function ($decodedPayload) {
            $userRows = $this->db->fetchAllAssociative('SELECT * FROM users', []);
            echo json_encode(['users' => $userRows]);
        });
    }


    public function oneUser(int $id)
    {
        // get one user
        //alleen de user kan zijn eigen pagina zien en of owner kan dit zien
        $auth = $this->Authorize('none');
        if ($auth) {
            $userID = $auth->id;
            if ($userID !== $id) {
                $this->message(401, 'You are not authorized to view this page');
                return;
            } else {
                $userRow = $this->db->fetchAssociative('SELECT * FROM users WHERE id = ?', [$id]);
                echo json_encode(['user' => $userRow]);
            }
        }
    }

    public function login()
    {
        $bodyParams = $this->httpBody;
        $email = $bodyParams['email'] ?? false;
        $password = $bodyParams['password'] ?? false;
        //postman tests
        //$username = $_POST['username'] ?? false;
        //$password = $_POST['password'] ?? false;
        if ($email && $password) {
            $user = $this->getUserFromDatabase($email);

            if (!$user) {
                $this->message(400, 'Foute inloggegevens'); // User does not exist in db
                return;
            }

            if (password_verify($password, $user['password'])) {
                $role = $user['role'];
                $immo = $user['immo_id'];

                $refreshToken = JWTService::generateJWTToken($user['id'], $user['username'], $role, null, SECRET_KEY, REFRESH_TOKEN_LIFETIME);

                setcookie('refreshToken', $refreshToken, time() + REFRESH_TOKEN_LIFETIME, "", "", false, true);


                $stmt = $this->db->prepare('INSERT INTO refresh_tokens (token, user_id) VALUES (?, ?)');
                $stmt->executeStatement([$refreshToken, $user['id']]);

                $jwtToken = JWTService::generateJWTToken($user['id'], $user['username'], $role, $immo, SECRET_KEY, ACCESS_TOKEN_LIFETIME);

                echo json_encode(['accessToken' => $jwtToken]);
            } else {
                $this->message(400, 'Invalid credentials'); // 401 Unauthorized
            }
        } else {
            $this->message(400, 'Gebruikersnaam en wachtwoord zijn verplicht'); // 400 Bad Request
        }
    }


    // Separate database interaction methods for better organization
    public function getUserFromDatabase(string $email)
    {

        $user = $this->db->fetchAssociative('SELECT * FROM users WHERE email =?', [$email]);

        return $user;
    }
    public function getUserFromDatabasebyId(int $id)
    {
        return $this->db->fetchAssociative('SELECT * FROM users WHERE id =?', [$id]);
    }


    // logout
    public function logout()
    {

        // For simplicity, let's assume you want to invalidate the token on the client side.
        echo json_encode(['message' => 'User logged out']);
    }

    public function onlyAdmins()
    {
        $auth = $this->Authorize('high');
        if ($auth) {
            $userID = $auth->id;
            $userRow = $this->db->fetchAssociative('SELECT * FROM users WHERE id = ?', [$userID]);
            echo json_encode(['user' => $userRow]);
        } else {
            $this->message(401, 'You are not authorized to view this page');
        }
    }

    public function Authorize($level)
    {
        $headers = apache_request_headers();
        if (isset($headers['X-Authorization'])) {
            $jwtToken = str_ireplace('Bearer ', '', $headers['X-Authorization']);
            try {
                $decodedPayload = JWTService::validateJWTToken($jwtToken, SECRET_KEY);
                $userId = $decodedPayload->id;
                $roles = $decodedPayload->roles;

                //IS EEN CHECK OF IEMAND EFFECTIEF IS INGELOGD (NONE)
                if ($level === 'none') {
                    if ($roles === "user" || $roles === "admin" || $roles === "immo" || $roles === "employee") {
                        return ($decodedPayload);
                    }
                }
                if ($level === 'low') {
                    if ($roles === "admin" || $roles === "immo" || $roles === "employee") {
                        return ($decodedPayload);
                    }
                } else if ($level === 'medium') {
                    if ($roles === "admin" || $roles === "immo") {
                        return ($decodedPayload);
                    }
                } else if ($level === 'high') {
                    if ($roles === "admin") {
                        return ($decodedPayload);
                    }
                }
            } catch (Exception $e) {
                // empty, will do 401
                $this->message(401, $e->getMessage());
                return false;
            }
        }
        $this->message(401, 'Invalid credentials test'); // 401 Unauthorized
        return false;
    }

    public function onlyOwners()
    {
        $auth = $this->Authorize('medium');
        if ($auth) {
            $userID = $auth->id;
            $userRow = $this->db->fetchAssociative('SELECT * FROM users WHERE id = ?', [$userID]);
            echo json_encode(['user' => $userRow]);
        } else {
            $this->message(401, 'You are not authorized to view this page');
        }
    }


    public function createUser()
    {
        $bodyParams = $this->httpBody;

        $username = $bodyParams['username'] ?? false;
        $password = $bodyParams['password'] ?? false;
        $email = $bodyParams['email'] ?? false;

        //postman tests
        //$username = $_POST['username'] ?? false;
        //$password = $_POST['password'] ?? false;
        //$email = $_POST['email'] ?? false;

        //echo json_encode(['username' => $username, 'password' => $password, 'email' => $email]);
        //exit;

        if (($username !== false) && ($email !== false) && ($password !== false)) {

            $errorList = [];

            // Check if user already exists
            $usernameCheck = $this->db->fetchAllAssociative("SELECT username FROM users WHERE username = ?", [$username]);
            if ($usernameCheck) {
                $this->message(409, 'Gebruikersnaam bestaat al');
                $errorList[] = 'Gebruikersnaam bestaat al';
            } elseif (strlen($username) < 3) {
                $errorList[] = 'Gebruikersnaam moet minstens 3 karakters lang zijn';
            }

            $emailCheck = $this->db->fetchAllAssociative("SELECT email FROM users WHERE email = ?", [$email]);
            if ($emailCheck) {
                $this->message(409, 'Dit E-mail adres is al in gebruik');
                $errorList[] = 'Dit E-mail adres is al in gebruik';
            } elseif (strlen($email) < 3 || strpos($email, '@') === false) {
                $errorList[] = 'Ongeldig E-mail adres';
            }

            if (strlen($password) < 3) {
                $errorList[] = 'Wachtwoord moet minstens 3 karakters lang zijn';
            }

            if (!$errorList) {
                $password = password_hash($password, PASSWORD_DEFAULT);

                $stmt = $this->db->prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)');
                $result = $stmt->executeStatement([$username, $email, $password, 'user']);

                //get last insert statement
                $user = $this->getUserFromDatabase($email);

                if ($user) {

                    $userId = $user['id'];
                    $role = $user['role'];
                    $immo_id = $user['immo_id'];

                    $jwtToken = JWTService::generateJWTToken($userId, $username, $role, $immo_id, SECRET_KEY, '60');
                    echo json_encode(['accessToken' => $jwtToken]);
                }

                // mailer doorsturen
                MailerService::send('Dynasty8@gmail.com', $email, 'U bent succesvol geregistreerd!', $username, '../resources/templates/index.html');

                if ($result) {
                    $this->message(201, 'User created');
                } else {
                    $this->message(503, 'Unable to create user');
                }
            } else {
                $this->message(422, json_encode(['errors' => $errorList]));
            }
        } else {
            $this->message(400, 'Unable to create user. Malformed request.'); // 400 Bad Request
        }
    }
}