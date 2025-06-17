<?php

namespace Services;

use Firebase\JWT\JWT;
use Firebase\JWT\BeforeValidException;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use Http\ApiBaseController;

class JWTService extends ApiBaseController
{
    public static function generateJWTToken(int $userId, string $userName, ?string $roles, ?int $immo_id, string $secretKey, int $seconds = 60 * 60): string
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + $seconds;

        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'id' => $userId,
            'username' => $userName,
            'roles' => $roles,
            'immo_id' => $immo_id
        ];


        return JWT::encode($payload, $secretKey, 'HS256');
    }

    public static function validateJWTToken(string $jwtToken, string $secretKey): \stdClass
    {
        try {
            return JWT::decode($jwtToken, new Key($secretKey, 'HS256'));
        } catch (ExpiredException $e) {
            throw new \Exception('Token expired');
        } catch (SignatureInvalidException $e) {
            throw new \Exception('Invalid token signature');
        } catch (BeforeValidException $e) {
            throw new \Exception('Token not valid yet');
        } catch (\Exception $e) {
            throw new \Exception('Invalid token');
        }
    }
}