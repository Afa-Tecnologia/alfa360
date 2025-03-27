<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

class ApiResponseService
{
    /**
     * Prepara os dados para resposta JSON, decodificando strings JSON em arrays
     *
     * @param mixed $data Os dados a serem formatados
     * @return mixed Os dados formatados
     */
    public static function formatResponse($data)
    {
        // Trata coleções do Eloquent
        if ($data instanceof Collection) {
            return $data->map(function ($item) {
                return self::formatResponse($item);
            })->all();
        }
        
        // Trata modelos do Eloquent
        if ($data instanceof Model) {
            $attributes = $data->toArray();
            $result = [];
            
            foreach ($attributes as $key => $value) {
                if ($key === 'images' && is_string($value)) {
                    $decoded = json_decode($value, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $result[$key] = $decoded;
                    } else {
                        $result[$key] = $value;
                    }
                } else {
                    $result[$key] = self::formatResponse($value);
                }
            }
            
            // Trata relacionamentos carregados
            foreach ($data->getRelations() as $relation => $relatedData) {
                $result[$relation] = self::formatResponse($relatedData);
            }
            
            return $result;
        }
        
        // Trata arrays regulares
        if (is_array($data)) {
            return array_map([self::class, 'formatResponse'], $data);
        } 
        
        // Trata objetos regulares
        if (is_object($data) && !($data instanceof \stdClass)) {
            $result = [];
            
            foreach (get_object_vars($data) as $key => $value) {
                if ($key === 'images' && is_string($value)) {
                    $decoded = json_decode($value, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $result[$key] = $decoded;
                    } else {
                        $result[$key] = $value;
                    }
                } else {
                    $result[$key] = self::formatResponse($value);
                }
            }
            
            return (object) $result;
        }
        
        // Para objetos stdClass
        if (is_object($data)) {
            $result = new \stdClass();
            
            foreach (get_object_vars($data) as $key => $value) {
                if ($key === 'images' && is_string($value)) {
                    $decoded = json_decode($value, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $result->$key = $decoded;
                    } else {
                        $result->$key = $value;
                    }
                } else {
                    $result->$key = self::formatResponse($value);
                }
            }
            
            return $result;
        }
        
        return $data;
    }
    
    /**
     * Retorna uma resposta JSON formatada
     *
     * @param mixed $data Os dados a serem retornados
     * @param int $status O código de status HTTP
     * @param array $headers Cabeçalhos adicionais
     * @return \Illuminate\Http\JsonResponse
     */
    public static function json($data, $status = 200, array $headers = [])
    {
        $formattedData = self::formatResponse($data);
        return response()->json($formattedData, $status, $headers);
    }
} 