<?php

namespace App\Http\Controllers\Categorias;

use App\Http\Controllers\Controller;
use App\Http\Requests\Categorias\StoreCategoriaRequest;
use App\Services\Categorias\CategoriaService;
use App\Services\Woocommerce\WoocommerceService;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class CategoriasController extends Controller
{
    protected $categoriaService;
    protected $woocommerceService;

    public function __construct(CategoriaService $categoriaService, WoocommerceService $woocommerceService)
    {
        $this->categoriaService = $categoriaService;
        $this->woocommerceService = $woocommerceService;
    }

    //Trazer todas as categorias 
    public function index()
    {
        $categorias = $this->categoriaService->getAll();
        return response()->json($categorias);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate(
                [
                    'name' => 'required|string|max:45|unique:categorias,name',
                    'description' => 'required|string',
                    'active' => 'required|boolean',
                ],
                [
                    'name.required' => 'O campo nome é obrigatório.',
                    'name.string' => 'O campo nome deve ser uma string.',
                    'name.max' => 'O campo nome deve ter no máximo 255 caracteres.',
                    'name.unique' => 'Já existe uma categoria com esse nome',
                    'description.required' => 'O campo descrição é obrigatório.',
                    'description.string' => 'O campo descrição deve ser uma string.',
                    'active.required' => 'O campo ativo é obrigatório.',
                    'active.boolean' => 'O campo ativo deve ser verdadeiro ou falso.',

                ]
            );



            $categoria = $this->categoriaService->create($data);


            //Passo o ID do produto no pdv para a tabela de sync com woocommerce
            $woocommerceData = [
                'name' => $request->name,
                'description' => $request->description,
                'pdv_id' => $categoria->id
            ];
            //Replica os dados no ecommerce
            $categoriaWocommerce = $this->woocommerceService->createCategory($woocommerceData);

            return response()->json([$categoria, $categoriaWocommerce], Response::HTTP_CREATED);
        } catch (\Exception $e) {

            return response()->json([
                'error' => 'Erro ao criar Categoria',
                'message' => $e->getMessage(), // Exibe o erro original
                'trace' => $e->getTraceAsString(), // Opcional: exibe o rastreamento
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($id)
    {
        return $this->categoriaService->getById($id);
    }

    public function update($id, Request $request)
    {



        try {
            $validatedData = $request->validate([
                'name' => 'nullable|string|max:45',
                'description' => 'nullable|string|max:255',
                'active' => 'nullable|boolean',

            ]);

            //Busco a existencia da categoria no woocommerce
            $categoriaNoWoocommerce = DB::table('woocommerce_sync')
                ->where('pdv_id', "=", $id)
                ->first();

            if ($categoriaNoWoocommerce) {
                $woocommerceId = $categoriaNoWoocommerce->woocommerce_id;
                $categoriaWoocommerce = $this->woocommerceService->updateCategory($woocommerceId, $validatedData);
                // return response()->json($categoriaWoocommerce);
            }


            $categoria = $this->categoriaService->update($id, $validatedData);

            if (!$categoria) {
                return response()->json(['error' => 'Categoria não encontrado'], 404);
            }

            return response()->json([$categoria, $categoriaWoocommerce], 200);
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Erro ao atualizar categoria'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    public function delete(string $id)
    {
        try {
            //Busco se a categoria esta sincronizada com woocommerce
            $categoriaNoWoocommerce = DB::table('woocommerce_sync')
                ->where('pdv_id', "=", $id)
                ->first();


            if ($categoriaNoWoocommerce) {
                $woocommerceId = $categoriaNoWoocommerce->woocommerce_id;
                $categoriaWoocommerce = $this->woocommerceService->deleteCategory($woocommerceId);
            }

            $categoria = $this->categoriaService->delete($id);

            if (!$categoria) {
                return response()->json(
                    ['error' => 'Categoria não encontrada'],
                    Response::HTTP_NOT_FOUND
                );
            }

            return response()->json(
                ['message' => 'Categoria deletada com sucesso', $categoriaWoocommerce],
                Response::HTTP_OK
            );
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Erro ao deletar categoria'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
