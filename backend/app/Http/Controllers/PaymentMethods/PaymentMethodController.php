<?php

namespace App\Http\Controllers\PaymentMethods;

use App\Http\Controllers\Controller;
use App\Services\PaymentMethods\PaymentMethodService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PaymentMethodController extends Controller
{
    protected $paymentMethodService;

    public function __construct(PaymentMethodService $paymentMethodService)
    {
        $this->paymentMethodService = $paymentMethodService;
    }

    public function index()
    {
        $paymentMethods = $this->paymentMethodService->getAll();
        return response()->json($paymentMethods);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:pagamento_metodos',
        ]);

        $paymentMethod = $this->paymentMethodService->create($validated);
        return response()->json($paymentMethod, Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $paymentMethod = $this->paymentMethodService->find($id);
        return response()->json($paymentMethod);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:255|unique:pagamento_metodos,code,' . $id,
        ]);

        $paymentMethod = $this->paymentMethodService->update($id, $validated);
        return response()->json($paymentMethod);
    }

    public function destroy($id)
    {
        $this->paymentMethodService->delete($id);
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
} 