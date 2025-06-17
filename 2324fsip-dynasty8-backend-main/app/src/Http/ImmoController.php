<?php

namespace Http;


use DirectoryIterator;
use \Services\DatabaseConnector;
use Http\UserController;


class ImmoController extends ApiBaseController
{
    protected \Doctrine\DBAL\Connection $db;
    protected UserController $userController;

    public function __construct()
    {
        parent::__construct();

        // initiate DB connection
        $this->db = DatabaseConnector::getConnection();

        $this->userController = new UserController();
    }

    public function allImmos()
    {
            $listingRow = $this->db->fetchAllAssociative("SELECT * FROM immos");

            if ($listingRow) {
                //$this->message(200, 'Immos found.');
                echo json_encode($listingRow);
            } else {
                $this->message(404, 'No immos found.');
            }
    }

    public function immoId($id)
    {
        //check if id exists
        $listingRow = $this->db->fetchAllAssociative("SELECT * FROM immos WHERE id = ?", [$id]);

        if ($listingRow) {
            echo json_encode($listingRow);
        } else {
            $this->message(404, 'Immo not found.');
        }
    }
    public function addImmo()
    {
        $auth = $this->userController->Authorize('none');

        if ($auth) {
            $immoId = $auth->immo_id;

            if ($immoId === null) {
                $bodyParams = $this->httpBody;
                // immos table
                $name = $bodyParams["name"] ?? false;
                $link = $bodyParams["link"] ?? false;

                // address table
                $streetname = $bodyParams["streetname"] ?? false;
                $number = $bodyParams["number"] ?? false;
                $city = $bodyParams["city"] ?? false;
                $zip = $bodyParams["zip"] ?? false;
                $bus = $bodyParams["bus"] ?? null; // set default to null
                $immoLogo = $bodyParams['immologo'] ?? null;
                $picturesPath = "./pictures";

                function get_next_filename($picturesPath)
                {
                    $dir = new DirectoryIterator($picturesPath);
                    $imageList = [];
                    foreach ($dir as $file) {
                        if ($file->isDot())
                            continue;
                        $imageList = $file;
                    }
                    if (empty($imageList)) {
                        return 1;
                    } else {
                        $maxNumber = 0;
                        foreach ($dir as $fileInfo) {
                            if ($fileInfo->isDot())
                                continue;
                            $number = intval($fileInfo->getBasename('.' . $fileInfo->getExtension()));
                            $maxNumber = max($maxNumber, $number);
                        }
                        return $maxNumber + 1;
                    }
                }

                $matches = [];
                preg_match('/^data:image\/(.*?);base64/', $immoLogo, $matches);
                $extension = $matches[1];

                $immoLogo = preg_replace('/^data:image\/(.*?);base64,/', '', $immoLogo);

                $immoLogo = base64_decode($immoLogo);
                $immoLogoFileName = get_next_filename($picturesPath) . '.' . $extension;
                $immoLogoFilePath = $picturesPath . '/' . $immoLogoFileName;
                file_put_contents($immoLogoFilePath, $immoLogo);

                // validating
                if (($name !== false) && ($link !== false) && ($streetname !== false) && ($city !== false) && ($zip !== false)) {

                    $errorList = [];

                    $nameCheck = $this->db->fetchAssociative('SELECT name FROM immos WHERE name = ?', [$name]);
                    if ($nameCheck) {
                        $this->message(400, 'Name already exists.');
                        $errorList[] = 'Name already exists.';
                    } elseif (strlen($name) < 3) {
                        $errorList[] = 'Name must be at least 3 characters long.';
                    }

                    if (strlen($link) < 10) {
                        $errorList[] = 'Link must be at least 10 characters long.';
                    }

                    if (isset($streetname) && (strlen($streetname) < 3 || strlen($streetname) > 100)) {
                        $errorList[] = 'Streetname is not correctly formatted';
                    }

                    if (isset($number) && (strlen($number) < 1 || strlen($number) > 4)) {
                        $errorList[] = 'Number is not correctly formatted';
                    }

                    if (isset($city) && (strlen($city) < 2 || strlen($city) > 100)) {
                        $errorList[] = 'City is not correctly formatted';
                    }

                    if (isset($zip) && (strlen($zip) < 4 || strlen($zip) > 7)) {
                        $errorList[] = 'Zip is not correctly formatted';
                    }

                    if ($bus !== null && $bus !== "") {
                        if (strlen($bus) < 1 || strlen($bus) > 4) {
                            $errorList[] = 'Bus is not correctly formatted';
                        }
                    }

                    if (empty($errorList)) {
                        $sql = "INSERT INTO addresses (streetname, number, bus, city, zip) VALUES (?, ?, ?, ?, ?)";
                        $stmt = $this->db->prepare($sql);
                        $stmt->executeStatement([$streetname, $number, $bus, $city, $zip]);

                        $addressId = $this->db->lastInsertId();

                        $sql = "INSERT INTO immos (name, link, address_id, active, verified, logo) VALUES (?, ?, ?, ?, ?, ?)";
                        $stmt = $this->db->prepare($sql);
                        $result = $stmt->executeStatement([$name, $link, $addressId, 0, 0, $immoLogoFileName]);

                        $immoId = $this->db->lastInsertId();

                        // Update the user's role and immo_id
                        $role = 'immo';
                        $userId = $auth->id;

                        $sql = "UPDATE users SET immo_id = ?, role = ? WHERE id = ?";
                        $stmt = $this->db->prepare($sql);
                        $result = $stmt->executeStatement([$immoId, $role, $userId]);

                        if ($result) {
                            $this->message(200, 'Immo has been created.');
                        } else {
                            $this->message(503, 'Unable to create immo.');
                        }
                    } else {
                        $this->message(422, json_encode($errorList));
                    }
                } else {
                    $this->message(400, 'Unable to create immo. Malformed request.');
                }

            }
        }
    }


    public function editImmo($id)
    {
        $auth = $this->userController->Authorize('medium');
        $immo_id = $auth->immo_id;
        //$userid = $auth->id;
        $role = $auth->roles;

        if ($auth) {
            if ($id === $immo_id || $role === 'admin') {
                $bodyParams = $this->httpBody;

                // immos table
                $name = $bodyParams["name"] ?? false;
                $link = $bodyParams["link"] ?? false;

                // address table
                $streetname = $bodyParams["streetname"] ?? false;
                $number = $bodyParams["number"] ?? false;
                $city = $bodyParams["city"] ?? false;
                $zip = $bodyParams["zip"] ?? false;
                $bus = $bodyParams["bus"] ?? null; // set default to null

                // validating
                if (($name !== false) && ($link !== false) && ($streetname !== false) && ($city !== false) && ($zip !== false)) {

                    $errorList = [];

                    $nameCheck = $this->db->fetchAssociative('SELECT name FROM immos WHERE name = ?', [$name]);
                    if ($nameCheck) {
                        $this->message(400, 'Name already exists.');
                        $errorList[] = 'Name already exists.';
                    } elseif (strlen($name) < 3) {
                        $errorList[] = 'Name must be at least 3 characters long.';
                    }

                    if (!str_contains($link, 'www.')) {
                        // WWW.A.BE is already 8 characters
                        $errorList[] = 'Link must contain www.';
                    } elseif (strlen($link) < 10) {
                        $errorList[] = 'Link must be at least 10 characters long.';
                    }

                    if (isset($streetname) && (strlen($streetname) < 3 || strlen($streetname) > 100)) {
                        $errorList[] = 'Streetname is not correctly formatted';
                    }

                    if (isset($number) && (strlen($number) < 1 || strlen($number) > 4)) {
                        $errorList[] = 'Number is not correctly formatted';
                    }

                    if (isset($city) && (strlen($city) < 2 || strlen($city) > 100)) {
                        $errorList[] = 'City is not correctly formatted';
                    }

                    if (isset($zip) && (strlen($zip) < 4 || strlen($zip) > 7)) {
                        $errorList[] = 'Zip is not correctly formatted';
                    }

                    if ($bus !== null && (strlen($bus) < 1 || strlen($bus) > 4)) {
                        $errorList[] = 'Bus is not correctly formatted';
                    }

                    if (empty($errorList)) {
                        $sql = "INSERT INTO addresses (streetname, number, bus, city, zip) VALUES (?, ?, ?, ?, ?)";
                        $stmt = $this->db->prepare($sql);
                        $stmt->executeStatement([$streetname, $number, $bus, $city, $zip]);

                        $addressId = $this->db->lastInsertId();

                        $sql = "INSERT INTO immos (name, link, address_id, active, verified) VALUES (?, ?, ?, ?, ?)";
                        $stmt = $this->db->prepare($sql);
                        $result = $stmt->executeStatement([$name, $link, $addressId, 0, 0]);

                        if ($result) {
                            $this->message(200, 'Immo has been created.');
                        } else {
                            $this->message(503, 'Unable to create immo.');
                        }
                    } else {
                        $this->message(422, implode(', ', $errorList));
                    }
                } else {
                    $this->message(400, 'Unable to create immo. Malformed request.');
                }
            }
        }
    }

    public function deleteImmo($id)
    {
        //check if id exists
        $immoCheck = $this->db->fetchAssociative('SELECT id FROM immos WHERE id = ?', [$id]);

        if ($immoCheck) {
            $sql = "DELETE FROM immos WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $result = $stmt->executeStatement([$id]);

            if ($result) {
                $this->message(200, 'Immo has been deleted.');
            } else {
                $this->message(503, 'Unable to delete immo.');
            }
        } else {
            $this->message(404, 'Immo not found.');
        }
    }

    public function nietGekeurdeImmos()
    {
        //selecteer alle immos waas de verified = 0
        $check = $this->db->fetchAssociative("SELECT * FROM immos WHERE verified = 0");

        if ($check) {
            $this->message(200, 'Immos found.');
            echo json_encode($check);
        } else {
            $this->message(404, 'No Immos found.');
        }
    }

    public function keurImmo($id)
    {
        $auth = $this->userController->Authorize('high');

        if ($auth) {
            $immoCheck = $this->db->fetchAssociative('SELECT id FROM immos WHERE id = ?', [$id]);

            if ($immoCheck) {
                $sql = "UPDATE immos SET verified = 1 WHERE immos.id = ?";
                $stmt = $this->db->prepare($sql);
                $result = $stmt->executeStatement([$id]);

                if ($result) {
                    $this->message(200, 'Immo has been verified.');
                } else {
                    $this->message(503, 'Unable to verify immo.');
                }
            } else {
                $this->message(404, 'Immo not found.');
            }
        }

    }

    public function pauzeerImmo($id)
    {
        //check if id exists
        $auth = $this->userController->Authorize('high');

        if ($auth) {
            $immoCheck = $this->db->fetchAssociative('SELECT id FROM immos WHERE id = ?', [$id]);

            if ($immoCheck) {
                $sql = "UPDATE immos SET active = 0 WHERE immos.id = ?";
                $stmt = $this->db->prepare($sql);
                $result = $stmt->executeStatement([$id]);

                if ($result) {
                    $this->message(200, 'Immo has been paused.');
                } else {
                    $this->message(503, 'Unable to pause immo.');
                }
            } else {
                $this->message(404, 'Immo not found.');
            }
        }
    }

    public function resumeImmo($id)
    {
        $auth = $this->userController->Authorize('high');

        //check if id exists
        if ($auth) {

            $immoCheck = $this->db->fetchAssociative('SELECT id FROM immos WHERE id = ?', [$id]);

            if ($immoCheck) {
                $sql = "UPDATE immos SET active = 1 WHERE immos.id = ?";
                $stmt = $this->db->prepare($sql);
                $result = $stmt->executeStatement([$id]);

                if ($result) {
                    $this->message(200, 'Immo has been resumed.');
                } else {
                    $this->message(503, 'Unable to resume immo.');
                }
            } else {
                $this->message(404, 'Immo not found.');
            }
        }
    }
}