<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Consolidado de Caixa</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 15px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .subtitle {
            font-size: 14px;
            margin-bottom: 5px;
        }
        .info {
            margin-bottom: 20px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            margin: 20px 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
        }
        .totals {
            background-color: #f9f9f9;
            font-weight: bold;
        }
        .signature {
            margin-top: 50px;
            text-align: center;
        }
        .signature-line {
            width: 200px;
            margin: 0 auto;
            border-top: 1px solid #333;
            padding-top: 5px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .page-break {
            page-break-after: always;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .bg-light {
            background-color: #f2f2f2;
        }
        .text-danger {
            color: #dc3545;
        }
        .text-success {
            color: #28a745;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Les Amis</div>
            <div class="title">Relatório Consolidado de Caixa</div>
            <div class="subtitle">Período: {{ $periodo }}</div>
        </div>

        <div class="info">
            <div class="info-row">
                <div><strong>Data de Emissão:</strong> {{ $data_emissao }}</div>
            </div>
        </div>

        <div class="section-title">Resumo Geral</div>
        <table>
            <tr>
                <th>Descrição</th>
                <th class="text-right">Valor (R$)</th>
            </tr>
            <tr>
                <td>Total de Vendas</td>
                <td class="text-right">{{ number_format($consolidado['totais']['total_vendas'], 2, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Total de Entradas</td>
                <td class="text-right">{{ number_format($consolidado['totais']['total_entradas'], 2, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Total de Saídas</td>
                <td class="text-right">{{ number_format($consolidado['totais']['total_saidas'], 2, ',', '.') }}</td>
            </tr>
            <tr class="totals">
                <td>Saldo Final</td>
                <td class="text-right">{{ number_format($consolidado['totais']['saldo_final'], 2, ',', '.') }}</td>
            </tr>
        </table>

        <div class="section-title">Vendas por Método de Pagamento</div>
        <table>
            <tr>
                <th>Método de Pagamento</th>
                <th class="text-right">Valor (R$)</th>
                <th class="text-right">Porcentagem</th>
            </tr>
            @foreach($consolidado['vendas_por_metodo'] as $metodo => $valor)
            <tr>
                <td>{{ $metodo }}</td>
                <td class="text-right">{{ number_format($valor, 2, ',', '.') }}</td>
                <td class="text-right">
                    @if($consolidado['totais']['total_vendas'] > 0)
                        {{ number_format(($valor / $consolidado['totais']['total_vendas']) * 100, 2, ',', '.') }}%
                    @else
                        0,00%
                    @endif
                </td>
            </tr>
            @endforeach
            <tr class="totals">
                <td>Total</td>
                <td class="text-right">{{ number_format($consolidado['totais']['total_vendas'], 2, ',', '.') }}</td>
                <td class="text-right">100,00%</td>
            </tr>
        </table>

        <div class="section-title">Entradas por Tipo</div>
        <table>
            <tr>
                <th>Tipo de Entrada</th>
                <th class="text-right">Valor (R$)</th>
                <th class="text-right">Porcentagem</th>
            </tr>
            @foreach($consolidado['entradas_por_tipo'] as $tipo => $valor)
            <tr>
                <td>{{ $tipo }}</td>
                <td class="text-right">{{ number_format($valor, 2, ',', '.') }}</td>
                <td class="text-right">
                    @if($consolidado['totais']['total_entradas'] > 0)
                        {{ number_format(($valor / $consolidado['totais']['total_entradas']) * 100, 2, ',', '.') }}%
                    @else
                        0,00%
                    @endif
                </td>
            </tr>
            @endforeach
            <tr class="totals">
                <td>Total</td>
                <td class="text-right">{{ number_format($consolidado['totais']['total_entradas'], 2, ',', '.') }}</td>
                <td class="text-right">100,00%</td>
            </tr>
        </table>

        <div class="section-title">Saídas por Tipo</div>
        <table>
            <tr>
                <th>Tipo de Saída</th>
                <th class="text-right">Valor (R$)</th>
                <th class="text-right">Porcentagem</th>
            </tr>
            @foreach($consolidado['saidas_por_tipo'] as $tipo => $valor)
            <tr>
                <td>{{ $tipo }}</td>
                <td class="text-right">{{ number_format($valor, 2, ',', '.') }}</td>
                <td class="text-right">
                    @if($consolidado['totais']['total_saidas'] > 0)
                        {{ number_format(($valor / $consolidado['totais']['total_saidas']) * 100, 2, ',', '.') }}%
                    @else
                        0,00%
                    @endif
                </td>
            </tr>
            @endforeach
            <tr class="totals">
                <td>Total</td>
                <td class="text-right">{{ number_format($consolidado['totais']['total_saidas'], 2, ',', '.') }}</td>
                <td class="text-right">100,00%</td>
            </tr>
        </table>

        @if(isset($consolidado['caixas']) && count($consolidado['caixas']) > 0)
        <div class="section-title">Detalhes por Caixa</div>
        <table>
            <tr>
                <th>Data</th>
                <th>Operador</th>
                <th class="text-right">Saldo Inicial</th>
                <th class="text-right">Entradas</th>
                <th class="text-right">Saídas</th>
                <th class="text-right">Saldo Final</th>
            </tr>
            @foreach($consolidado['caixas'] as $caixa)
            <tr>
                <td>{{ \Carbon\Carbon::parse($caixa['open_date'])->format('d/m/Y') }}</td>
                <td>{{ $caixa['user_name'] }}</td>
                <td class="text-right">{{ number_format($caixa['saldo_inicial'], 2, ',', '.') }}</td>
                <td class="text-right">{{ number_format($caixa['total_entradas'], 2, ',', '.') }}</td>
                <td class="text-right">{{ number_format($caixa['total_saidas'], 2, ',', '.') }}</td>
                <td class="text-right">{{ number_format($caixa['saldo_final'], 2, ',', '.') }}</td>
            </tr>
            @endforeach
        </table>
        @endif

        <div class="signature">
            <div class="signature-line">Assinatura do Responsável</div>
        </div>

        <div class="footer">
            <p>Relatório gerado automaticamente para Loja Les Amis - {{ $data_emissao }}</p>
            <p>Alfa Manager - Todos os direitos reservados. Desenvolvido por Júnior Teixeira - <a href="https://www.alfatecnologiabrasil.com.br" target="_blank">Alfa Tecnologia</a></p>
        </div>
    </div>
</body>
</html> 