# Componentes Reutilizáveis

## BarcodeScanner

O `BarcodeScanner` é um componente que permite escanear códigos de barras utilizando a câmera do dispositivo. É útil para buscar produtos rapidamente no sistema.

### Instalação

O componente utiliza a biblioteca @zxing/library para decodificação de códigos de barras. Certifique-se de que ela está instalada:

```bash
npm install @zxing/library
```

### Uso Básico

```tsx
import { BarcodeScanner } from '@/components/Reusable/BarcodeScanner';

export default function MeuComponente() {
  const handleBarcodeScan = (result: string) => {
    console.log('Código escaneado:', result);
    // Faça algo com o resultado
  };

  return (
    <div>
      <h1>Meu Sistema</h1>

      <BarcodeScanner
        onScan={handleBarcodeScan}
        buttonLabel="Escanear Código"
      />
    </div>
  );
}
```

### Props

| Prop          | Tipo                       | Padrão | Descrição                                                                                                   |
| ------------- | -------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| `onScan`      | `(result: string) => void` | -      | Função chamada quando um código de barras é escaneado com sucesso. Recebe o valor do código como parâmetro. |
| `buttonSize`  | `'sm' \| 'md' \| 'lg'`     | `'md'` | Tamanho do botão de escaneamento.                                                                           |
| `buttonLabel` | `string`                   | -      | Texto a ser exibido no botão. Se não for fornecido, apenas o ícone será mostrado.                           |

### Implementação em Cadastro de Produtos

O componente está implementado no formulário de produtos, permitindo escanear códigos de barras para preenchimento automático do campo "Código":

```tsx
<div className="flex gap-2">
  <Input
    value={code}
    onChange={(e) => setCode(e.target.value)}
    className="p-4 flex-1"
    placeholder="Digite ou escaneie o código do produto"
  />
  <BarcodeScanner onScan={(value) => setCode(value)} buttonLabel="Escanear" />
</div>
```

### Implementação na Tela de Vendas

Na tela de vendas, o componente está implementado para buscar produtos pelo código de barras:

```tsx
<BarcodeScanner
  onScan={async (code) => {
    try {
      // Busca o produto pelo código de barras na API
      const product = await ProductService.getProductByBarcode(code);
      if (product) {
        // Se encontrar, define o termo de busca para o nome do produto
        setSearchTerm(product.name);
      } else {
        gerarNotificacao(
          'warning',
          'Produto não encontrado com este código de barras'
        );
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
    }
  }}
  buttonLabel="Escanear"
/>
```

### Funcionalidades

- **Acesso à Câmera**: O componente solicita acesso à câmera do dispositivo para escanear códigos de barras.
- **Modal de Escaneamento**: Quando o botão é clicado, um modal é aberto com o feed da câmera para escanear o código de barras.
- **Decodificação Automática**: O componente decodifica automaticamente os códigos de barras que aparecem na câmera.
- **Controle de Lanterna**: Quando disponível, o componente permite ligar/desligar a lanterna da câmera.
- **Responsivo**: O componente é responsivo e funciona em dispositivos móveis e desktop.

### Requisitos

- O dispositivo precisa ter uma câmera.
- O usuário precisa conceder permissão para acessar a câmera.
- O navegador precisa suportar a API MediaDevices.

### Limitações

- Em dispositivos iOS, o componente funcionará melhor no Safari, pois outros navegadores podem ter limitações ao acessar a câmera.
- Em ambientes com pouca luz, pode ser necessário usar a lanterna para melhorar a leitura do código.
