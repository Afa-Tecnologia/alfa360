<?php
namespace App\Services\Produtos;

use App\Models\Produto;
use App\Models\Variantes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProdutoService
{
    public function getAll()
    {
        return Produto::with('variants')->get();
    }

    public function getById($id)
    {
        return Produto::with('variants')->find($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $produto = Produto::create($data);

            if (isset($data['variants']) && is_array($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    $this->createVariant($produto->id, $variantData);
                }
            }

            return $produto->load('variants');
        });
    }

    public function createVariant($productId, array $data)
    {
        $data['product_id'] = $productId;

        if (isset($data['images']) && is_array($data['images'])) {
            $imageUrls = [];

            foreach ($data['images'] as $image) {
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $path = $image->store('variants', 'public');
                    $imageUrls[] = asset("storage/{$path}");
                } else {
                    $imageUrls[] = $image;
                }
            }

            $data['images'] = json_encode($imageUrls);
        }

        return Variantes::create($data);
    }

    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $produto = Produto::findOrFail($id);
            $produto->update($data);

            if (isset($data['variants']) && is_array($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    if (isset($variantData['id'])) {
                        $this->updateVariant($variantData['id'], $variantData);
                    } else {
                        $this->createVariant($produto->id, $variantData);
                    }
                }
            }

            return $produto->load('variants');
        });
    }

    public function updateVariant($variantId, array $data)
    {
        $variant = Variantes::findOrFail($variantId);

        if (isset($data['images']) && is_array($data['images'])) {
            $imageUrls = [];

            foreach ($data['images'] as $image) {
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $path = $image->store('variants', 'public');
                    $imageUrls[] = asset("storage/{$path}");
                } else {
                    $imageUrls[] = $image;
                }
            }

            $data['images'] = json_encode($imageUrls);
        }

        $variant->update($data);
        return $variant;
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $produto = Produto::findOrFail($id);

            // Deleta variantes e imagens associadas
            foreach ($produto->variants as $variant) {
                $this->deleteVariant($variant->id);
            }

            $produto->delete();
            return true;
        });
    }

    public function deleteVariant($variantId)
    {
        $variant = Variantes::findOrFail($variantId);

        if ($variant->images) {
            $images = json_decode($variant->images, true);
            foreach ($images as $image) {
                $imagePath = str_replace(asset('storage/'), '', $image);
                Storage::disk('public')->delete($imagePath);
            }
        }

        $variant->delete();
    }
}
