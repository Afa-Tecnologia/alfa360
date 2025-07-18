# Refatoração do Módulo de Vendas

## Estrutura Recomendada

```
/vendas
  /components
    CartPanel.tsx
    ProductDetailsDialog.tsx
    FinalizeSaleDialog.tsx
    SalesStatsCard.tsx
    SalesReceipt.tsx
    ...
  /hooks
    useSales.ts
    useCart.ts
    useProducts.ts
    usePayment.ts
  /services
    salesService.ts
    paymentService.ts
    ...
  VendasDashboardContainer.tsx
  VendasDashboard.tsx
  index.ts
```

---

## Diagrama de Arquitetura

```mermaid
flowchart TD
  subgraph UI
    B[VendasDashboard (UI)]
    H[CartPanel]
    I[ProductDetailsDialog]
    J[FinalizeSaleDialog]
    K[SalesStatsCard]
    L[SalesReceipt]
  end

  subgraph Container
    A[VendasDashboardContainer]
  end

  subgraph Hooks
    C[useSales]
    D[useCart]
    E[useProducts]
    M[usePayment]
  end

  subgraph Services
    F[salesService]
    G[paymentService]
  end

  A --> B
  B --> H
  B --> I
  B --> J
  B --> K
  B --> L

  A --> C
  A --> D
  A --> E
  A --> M

  C --> F
  C --> G
  M --> G
```

---

## Fluxo de Responsabilidades

- **VendasDashboardContainer**:  
  Responsável por orquestrar dados, hooks e lógica de negócio.  
  Passa apenas props necessárias para o componente de UI.

- **VendasDashboard (UI)**:  
  Componente de apresentação, sem lógica de negócio.  
  Recebe dados e callbacks via props.

- **Hooks (`useSales`, `useCart`, `useProducts`, `usePayment`)**:  
  Encapsulam lógica de negócio, manipulação de estado e integração com services.

- **Services (`salesService`, `paymentService`)**:  
  Responsáveis por chamadas de API, montagem de payloads e tratamento de erros.

- **Components**:  
  Componentes de UI puros, desacoplados de lógica de negócio.

---

## Benefícios

- **SOLID**: Cada módulo tem uma responsabilidade única.
- **Clean Code**: Código limpo, fácil de entender e manter.
- **Escalabilidade**: Fácil adicionar novas features sem quebrar o fluxo.
- **Performance**: Hooks e memoização otimizam renderizações.
- **Segurança**: Validação e tratamento de erros centralizados.
- **Testabilidade**: Lógica de negócio isolada, facilitando testes unitários.

---

> Para dúvidas ou exemplos práticos de implementação, consulte a equipe de arquitetura ou peça exemplos de hooks/services.
