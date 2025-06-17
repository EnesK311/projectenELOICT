<?php

namespace Http;

use \Services\DatabaseConnector;
use Services\JWTService;

class MyController extends ApiBaseController
{
    protected \Doctrine\DBAL\Connection $db;

    public function __construct()
    {
        parent::__construct();

        // initiate DB connection
        $this->db = DatabaseConnector::getConnection();
    }

    // file: MyController.php

}