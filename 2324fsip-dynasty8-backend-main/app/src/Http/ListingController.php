<?php

namespace Http;

use DirectoryIterator;
use Doctrine\DBAL\Exception;
use \Services\DatabaseConnector;
use Services\MailerService;

class ListingController extends ApiBaseController
{
    private int $listingId;


    protected \Doctrine\DBAL\Connection $db;
    protected UserController $userController;
    public function __construct()
    {
        parent::__construct();

        // initiate DB connection
        $this->db = DatabaseConnector::getConnection();

        $this->userController = new UserController();
    }

    public function getListingsByIds()
    {
        $bodyParams = $this->httpBody;
        var_dump($bodyParams);

        $listingRows = $this->db->fetchAssociative("
SELECT listings.id, price, immo_id, status, contract, streetname, number, bus, zip, city, properties.type, bedrooms, living_area, thumbnail_name FROM `listings`
INNER JOIN addresses on addresses.id = listings.address_id
INNER JOIN pictures on pictures.listing_id = listings.id
INNER JOIN properties on properties.listing_id = listings.id
WHERE listings.id = ?");

        if ($listingRows)
            echo json_encode($listingRows);
        else {
            $this->message(404, 'No listings found.');
        }

        // get all listings!!
    }

    public function getAllProperties()
    {
        $propertyRows = $this->db->fetchAllAssociative("
SELECT listings.id, price, immo_id, status, contract, streetname, number, bus, zip, city, properties.type, bedrooms, living_area, thumbnail_name FROM `listings`
INNER JOIN addresses on addresses.id = listings.address_id
INNER JOIN pictures on pictures.listing_id = listings.id
INNER JOIN properties on properties.listing_id = listings.id");

        if ($propertyRows)
            echo json_encode($propertyRows);
        else {
            $this->message(404, 'No properties found.');
        }
    }
    public function getAllLand()
    {
        $landRows = $this->db->fetchAllAssociative("
SELECT listings.id, price, immo_id, status, contract, streetname, number, bus, zip, city, land.type, area, thumbnail_name FROM `listings`
INNER JOIN addresses on addresses.id = listings.address_id
INNER JOIN pictures on pictures.listing_id = listings.id
INNER JOIN land on land.listing_id = listings.id");

        if ($landRows)
            echo json_encode($landRows);
        else {
            $this->message(404, 'No land found.');
        }
    }


    public function getPropertyById($id)
    {
        // get one listing
        $listingRow = $this->db->fetchAssociative('
SELECT
    listings.id,
    price,
    immo_id,
    immos.logo,
	status,
    contract,
    streetname,
    number,
    bus,
    zip,
    city,
    properties.type,
    bedrooms,
    bathrooms,
    building_year,
    living_area,
    building_area,
    garden_area,
    thumbnail_name,
    GROUP_CONCAT(detailpictures.image_name) AS image_names,
    description,
    properties.epc,
    properties.garagesize
    
FROM
    `listings`
INNER JOIN addresses ON addresses.id = listings.address_id
INNER JOIN immos ON immos.id = listings.immo_id
INNER JOIN pictures ON pictures.listing_id = listings.id
INNER JOIN detailpictures ON detailpictures.picture_id = pictures.id
INNER JOIN properties ON properties.listing_id = listings.id
WHERE
    listings.id = ?', [$id]);

        if ($listingRow)
            echo json_encode($listingRow);
        else {
            $this->message(404, 'Property does not exist.');
        }
    }


    public function getLandById($id)
    {
        // get one listing
        $landRow = $this->db->fetchAssociative('
SELECT
    listings.id,
    price,
    immo_id,
    immos.logo,
	status,
    contract,
    streetname,
    number,
    bus,
    zip,
    city,
    land.type,
    land.area,
    thumbnail_name,
    GROUP_CONCAT(detailpictures.image_name) AS image_names,
    description
    
FROM
    `listings`
INNER JOIN addresses ON addresses.id = listings.address_id
INNER JOIN immos ON immos.id = listings.immo_id
INNER JOIN pictures ON pictures.listing_id = listings.id
INNER JOIN detailpictures ON detailpictures.picture_id = pictures.id
INNER JOIN land ON land.listing_id = listings.id
WHERE
    listings.id = ?', [$id]);

        if ($landRow)
            echo json_encode($landRow);
        else {
            $this->message(404, 'Land does not exist.');
        }
    }

    public function testListings()
    {
        echo json_encode(['message' => 'Product has been created.']);
    }

    public function addListing($bodyParams): array
    {
        $auth = $this->userController->Authorize('low');
        if ($auth) {
            $saleRent = $bodyParams['saleRent'] ?? false;
            $description = $bodyParams['description'] ?? false;
            $streetname = $bodyParams['streetname'] ?? false;
            $status = $bodyParams['status'] ?? false;
            $number = $bodyParams['housenumber'] ?? false;
            $city = $bodyParams['city'] ?? false;
            $zip = $bodyParams['zip'] ?? false;
            $bus = $bodyParams['bus'] ?? null;
            $price = $bodyParams['price'] ?? null;
            $picturesPath = "./pictures";

            $thumbnailImg = $bodyParams['thumbnailImg'] ?? null;
            $imgs = $bodyParams['imgs'] ?? [];

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
            preg_match('/^data:image\/(.*?);base64/', $thumbnailImg, $matches);
            $extension = $matches[1];

            $thumbnailImg = preg_replace('/^data:image\/(.*?);base64,/', '', $thumbnailImg);

            $thumbnailImage = base64_decode($thumbnailImg);

            $thumbnailFileName = get_next_filename($picturesPath) . '.' . $extension;
            $thumbnailFilePath = $picturesPath . '/' . $thumbnailFileName;
            file_put_contents($thumbnailFilePath, $thumbnailImage);

            foreach ($imgs as $imageData) {
                $matches = [];
                if (preg_match('/^data:image\/(.*?);base64/', $imageData, $matches)) {
                    $extension = $matches[1];
                }
                $imageData = preg_replace('/^data:image\/(.*?);base64,/', '', $imageData);

                $image = base64_decode($imageData);
                $imageFileName = get_next_filename($picturesPath) . '.' . $extension;
                $imageFilePath = $picturesPath . '/' . $imageFileName;

                file_put_contents($imageFilePath, $image);
                $imageFileNames[] = $imageFileName;
            }

            //VALIDATION
            $errorList = [];
            //checking post request
            if (!$saleRent || !$description || !$streetname || !$number || !$city || !$zip || !$thumbnailImg || empty($imgs)) {
                $this->message(400, 'Unable to create product. Malformed request.'); // 400 Bad Request
            }

            if ($saleRent !== 'sale' && $saleRent !== 'rent') {
                $errorList[] = 'Sale or rent not selected';
            }

            if (strlen($description) > 3000) {
                $errorList[] = 'Description is too long';
            }
            if ($price != null) {
                if (($price < 0 || $price > 1000000000)) {
                    $errorList[] = 'Price is not correctly formatted';
                }
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

            if ($bus != null) {
                if ((strlen($bus) < 1 || strlen($bus) > 4)) {
                    $errorList[] = 'Bus is not correctly formatted';
                }
            }
            if ($errorList) {
                return $errorList;
            }
            // create listing

            //3 TABBELLEN LISTING PROPERTIES EN ADDRESSES

            //INSERTING ADDRESS FIRST

            $sql = "INSERT INTO addresses (streetname, number, bus, city, zip) VALUES (?, ?, ?, ?, ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->executeStatement([
                $streetname,
                $number,
                $bus,
                $city,
                $zip
            ]);

            //GETTING ADDRESS ID

            $addressId = $this->db->lastInsertId();
            echo json_encode(['adressid' => $addressId]);

            //INSERTING LISTING
            $sql = "INSERT INTO listings (address_id, price, immo_id, status, contract, description) VALUES (?, ?, ?, ?, ?, ?)";

            $stmt = $this->db->prepare($sql);

            $stmt->executeStatement([
                $addressId,
                $price,
                1,
                "available",
                $saleRent,
                $description
            ]);

            $this->listingId = $this->db->lastInsertId();

            $sql = "INSERT INTO pictures (listing_id, thumbnail_name) VALUES (?, ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->executeStatement([$this->listingId, $thumbnailFileName]);

            $picturesId = $this->db->lastInsertId();

            $sql = "INSERT INTO detailpictures (picture_id, image_name) VALUES (?, ?)";
            $stmt = $this->db->prepare($sql);

            foreach ($imageFileNames as $imageFileName) {
                $stmt->executeStatement([$picturesId, $imageFileName]);
            }

            $this->message(201, 'Product has been created.'); // 201 Created

        } else {
            $this->message(400, 'You need to be connected to an immo to add a listing');

        }
        return $errorList;
    }

    public function addProperty()
    {
        $auth = $this->userController->Authorize('low');

        if ($auth) {
            //put all requests in variables
            $bodyParams = $this->httpBody;
            $listingErrors = $this->addListing($bodyParams);
            $propertytype = $bodyParams['propertytype'] ?? false;
            $bedrooms = $bodyParams['bedrooms'] ?? false;
            $bathrooms = $bodyParams['bathrooms'] ?? false;
            $epc = $bodyParams['epc'] ?? false;

            $livingarea = $bodyParams['livingarea'] ?? false;
            //optional
            $garagesize = $bodyParams['garagesize'] ?? null;
            $gardenarea = $bodyParams['gardenarea'] ?? null;
            $buildingarea = $bodyParams['buildingarea'] ?? null;

            $year = $bodyParams['year'] ?? null;


            //VALIDATION
            $errorList = [];
            foreach ($listingErrors as $error) {
                $errorList[] = $error;
            }
            //checking post request
            if (!$propertytype || !$bedrooms || !$bathrooms || !$livingarea || !$this->listingId) {
                $this->message(400, 'Unable to create product. Malformed request.'); // 400 Bad Request
            }

            if ($propertytype !== 'house' && $propertytype !== 'appartement') {
                $errorList[] = 'Property type not selected';
            }

            if ($bedrooms < 0 || $bedrooms > 10) {
                $errorList[] = 'Bedrooms not selected';
            }

            if ($bathrooms != null) {
                if ($bathrooms < 0 || $bathrooms > 10) {
                    $errorList[] = 'Bathrooms not selected';
                }
            }

            if ($garagesize != null) {
                if ($garagesize < 0 || $garagesize > 10) {
                    $errorList[] = 'Garage size not selected';
                }
            }

            if ($year != '') {
                if (($year < 0 || $year > 2030)) {
                    $errorList[] = 'Year is not correctly formatted';
                }
            }


            if (isset($epc) && (strlen($epc) > 2 || strlen($epc) < 0)) {
                $errorList[] = 'EPC is not correctly formatted';
            }

            if ($errorList) {
                $this->message(422, implode(' ', $errorList)); // 422 Unprocessable Entity
                exit; // EXIT_
            }


            //GETTING LISTING ID

            echo json_encode(['listingid' => $this->listingId]);

            //INSERTING PROPERTIES
            $sql = "INSERT INTO properties (type, living_area, building_area, garden_area, bedrooms, bathrooms, building_year, epc, garagesize, listing_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $stmt = $this->db->prepare($sql);
            $stmt->executeStatement([
                $propertytype,
                $livingarea,
                $buildingarea,
                $gardenarea,
                $bedrooms,
                $bathrooms,
                $year,
                $epc,
                $garagesize,
                $this->listingId
            ]);


            if ($this->listingId) {
                $this->message(201, 'Product has been created.'); // 201 Created

            } else {
                $this->message(422, implode(', ', $errorList)); // Unprocessabvle entity

            }
        } else {
            $this->message(400, 'You need to be connected to an immo to add a listing');
        }
    }

    public function addLand()
    {

        $auth = $this->userController->Authorize('low');

        if ($auth) {
            $bodyParams = $this->httpBody;
            $listingErrors = $this->addListing($bodyParams);
            $landtype = $bodyParams['type'] ?? false;
            $area = $bodyParams['area'] ?? false;

            // Validation
            $errorList = [];
            foreach ($listingErrors as $error) {
                $errorList[] = $error;
            }

            if ($landtype && $area && !$listingErrors && $this->listingId) {
                if ($landtype !== 'farmland' && $landtype !== 'buildland') {
                    $errorList[] = 'Invalid land type selected.';
                }

                if ($area < 0 || $area > 1000000000) {
                    $errorList[] = 'Area is not correctly formatted.';
                }

                if (!$errorList) {
                    // Inserting land
                    $sql = "INSERT INTO land (type, area, listing_id) VALUES (?, ?, ?)";
                    $stmt = $this->db->prepare($sql);
                    $result = $stmt->executeStatement([$landtype, $area, $this->listingId]);

                    if ($result) {
                        $this->message(201, 'Product has been created.'); // 201 Created
                    } else {
                        $this->message(503, 'Unable to create'); // 503 Service Unavailable
                    }
                } else {
                    $this->message(422, implode(' ', $errorList)); // 422 Unprocessable Entity
                }

            } else {
                $this->message(400, 'Unable to create product. Malformed request.'); // 400 Bad Request
            }
        } else {
            $this->message(400, 'You need to be connected to an immo to add a listing');
        }
    }


    public function editListing($id)
    {



    }

    public function getAllListingsImmo($id)
    {
        $auth = $this->userController->Authorize('low');
        if ($auth) {
            $listingRow = $this->db->fetchAssociative('
SELECT
    listings.id,
    price,
    immo_id,
    immos.logo,
	status,
    contract,
    streetname,
    number,
    bus,
    zip,
    city,
    properties.type,
    bedrooms,
    bathrooms,
    building_year,
    living_area,
    building_area,
    garden_area,
    thumbnail_name,
    GROUP_CONCAT(detailpictures.image_name) AS image_names,
    description,
    properties.epc,*
    properties.garagesize
    
FROM
    `listings`
INNER JOIN addresses ON addresses.id = listings.address_id
INNER JOIN immos ON immos.id = listings.immo_id
INNER JOIN pictures ON pictures.listing_id = listings.id
INNER JOIN detailpictures ON detailpictures.picture_id = pictures.id
INNER JOIN properties ON properties.listing_id = listings.id
WHERE
    listings.immo_id = ?', [$id]);

            if ($listingRow)
                echo json_encode($listingRow);
            else {
                $this->message(404, 'No properties found.');
            }
        }
    }

    public function getAllLandImmo($id)
    {
        $auth = $this->userController->Authorize('low');
        if ($auth) {
            $landRow = $this->db->fetchAssociative('
SELECT
    listings.id,
    price,
    immo_id,
    immos.logo,
	status,
    contract,
    streetname,
    number,
    bus,
    zip,
    city,
    land.type,
    land.area,
    thumbnail_name,
    GROUP_CONCAT(detailpictures.image_name) AS image_names,
    description
    
FROM
    `listings`
INNER JOIN addresses ON addresses.id = listings.address_id
INNER JOIN immos ON immos.id = listings.immo_id
INNER JOIN pictures ON pictures.listing_id = listings.id
INNER JOIN detailpictures ON detailpictures.picture_id = pictures.id
INNER JOIN land ON land.listing_id = listings.id
WHERE
    listings.id = ?', [$id]);

            if ($landRow)
                echo json_encode($landRow);
            else {
                $this->message(404, 'No land found.');
            }
        }

    }

    public function deleteListing($id)
    {
        $auth = $this->userController->Authorize('low');
        if ($auth) {
            $immoID = $auth->immo_id;
            $listingRow = $this->db->fetchAssociative('SELECT immo_id FROM listings WHERE id = ?', [$id]);

            if ($immoID === $listingRow) {
                $sql = "DELETE FROM listings WHERE id = ?";
                $stmt = $this->db->prepare($sql);
                $stmt->executeStatement([$id]);
                $this->message(200, 'Product has been deleted.'); // 200 OK
            } else {
                $this->message(404, 'Product does not exist.'); // 404 Not Found
            }
        }
    }
    public function addFavorite()
    {
        $auth = $this->userController->Authorize('none');

        if ($auth) {
            $userId = $auth->id;
            $bodyParams = $this->httpBody;
            $listingid = $bodyParams['listingId'];
            echo json_encode(["userid" => $userId]);

            $sql = "INSERT INTO favorites (user_id, listing_id) VALUES (?, ?)";
            $stmt = $this->db->prepare($sql);
            $result = $stmt->executeStatement([$userId, $listingid]);

        }
    }

    public function removeFavorite(){
        $auth = $this->userController->Authorize('none');

        if ($auth) {
            $userId = $auth->id;
            $bodyParams = $this->httpBody;
            $listingid = $bodyParams['listingId'];
            $stmt = $this->db->prepare("DELETE FROM favorites where user_id = ? and listing_id = ?");
            $stmt->executeStatement([$userId, $listingid]);
        }
    }
    public function getAllFavorites(){
        $auth = $this->userController->Authorize('none');
        if ($auth){
            $userId = $auth->id;
            $stmt = $this->db->prepare("SELECT listing_id FROM favorites where user_id = ?");
            $stmt->bindValue(1, $userId);
            $result = $stmt->executeQuery();
            $favorites = $result->fetchFirstColumn();

            if ($favorites){
                echo json_encode($favorites);
            }
            else $this->message(404, 'No favorites found');
        }
    }

    public function filterListing()
    {
        $bodyParams = $this->httpBody;

        $koopHuur = $bodyParams['koopHuur'] ?? false;
        $epc = $bodyParams['epc'] ?? false;
        $garage = $bodyParams['garage'] ?? false;
        $maxBathrooms = $bodyParams['maxBathrooms'] ?? false;
        $maxBedrooms = $bodyParams['maxBedrooms'] ?? false;
        $maxBuildArea = $bodyParams['maxBuildArea'] ?? false;
        $maxBuildPrice = $bodyParams['maxBuildPrice'] ?? false;
        $maxGardenArea = $bodyParams['maxGardenArea'] ?? false;
        $maxLivingArea = $bodyParams['maxLivingArea'] ?? false;
        $minBathrooms = $bodyParams['minBathrooms'] ?? false;
        $minBedrooms = $bodyParams['minBedrooms'] ?? false;
        $minBuildArea = $bodyParams['minBuildArea'] ?? false;
        $minBuildPrice = $bodyParams['minBuildPrice'] ?? false;
        $minBuildYear = $bodyParams['minBuildYear'] ?? false;
        $minGardenArea = $bodyParams['minGardenArea'] ?? false;
        $minLivingArea = $bodyParams['minLivingArea'] ?? false;
        $search = $bodyParams['search'] ?? false;
        $type = $bodyParams['type'] ?? false;

        $landMaxPrice = $bodyParams['landMaxPrice'] ?? false;
        $landMinPrice = $bodyParams['landMinPrice'] ?? false;
        $landSearch = $bodyParams['landSearch'] ?? false;
        $landType = $bodyParams['landType'] ?? false;
        $landArea = $bodyParams['landArea'] ?? false;

        if ($type === 'Huis' || $type === 'Appartement') {
            //$sql = "SELECT FROM listings INNER JOIN properties INNER JOIN addresses";
            $sql = "SELECT * FROM `listings` INNER JOIN addresses ON addresses.id = listings.address_id INNER JOIN pictures ON pictures.listing_id = listings.id INNER JOIN properties ON properties.listing_id = listings.id WHERE";

            $stmt = $this->db->prepare($sql);
            $result = $stmt->executeStatement();

            if ($search) {
                $sql .= "listings.description LIKE ?";
            }
            if ($koopHuur) {
                $sql .= " AND contract LIKE ?";
            }

            if ($epc) {
                $sql .= " AND epc LIKE ?";
            }

            if ($garage) {
                $sql .= " AND garagesize LIKE ?";
            }

            if ($maxBathrooms) {
                $sql .= " AND bathrooms <= ?";
            }

            if ($maxBedrooms) {
                $sql .= " AND bedrooms <= ?";
            }

            if ($maxBuildArea) {
                $sql .= " AND building_area <= ?";
            }

            if ($maxBuildPrice) {
                $sql .= " AND price <= ?";
            }

            if ($maxGardenArea) {
                $sql .= " AND garden_area <= ?";
            }

            if ($maxLivingArea) {
                $sql .= " AND living_area <= ?";
            }

            if ($minBathrooms) {
                $sql .= " AND bathrooms >= ?";
            }

            if ($minBedrooms) {
                $sql .= " AND bedrooms >= ?";
            }

            if ($minBuildArea) {
                $sql .= " AND building_area >= ?";
            }

            if ($minBuildPrice) {
                $sql .= " AND price >= ?";
            }

            if ($minBuildYear) {
                $sql .= " AND building_year >= ?";
            }

            if ($minGardenArea) {
                $sql .= " AND garden_area >= ?";
            }

            if ($minLivingArea) {
                $sql .= " AND living_area >= ?";
            }

            if ($type) {
                $sql .= " AND type LIKE ?";
            }

            $stmt = $this->db->prepare($sql);
            $result = $stmt->executeStatement([
                $search,
                $koopHuur,
                $epc,
                $garage,
                $maxBathrooms,
                $maxBedrooms,
                $maxBuildArea,
                $maxBuildPrice,
                $maxGardenArea,
                $maxLivingArea,
                $minBathrooms,
                $minBedrooms,
                $minBuildArea,
                $minBuildPrice,
                $minBuildYear,
                $minGardenArea,
                $minLivingArea,
                $type
            ]);
        }
    }
}