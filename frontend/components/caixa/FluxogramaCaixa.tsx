'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRight,
  ClipboardList,
  DollarSign,
  Lock,
  Unlock,
  History,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FluxogramaCaixa() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">
          Fluxograma de Operação do Caixa
        </CardTitle>
        <CardDescription>
          Guia passo a passo para a gestão do caixa durante o dia
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col space-y-8 relative">
          {/* Linha vertical que conecta os passos */}
          <div className="absolute left-5 top-6 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

          {/* Passo 1: Abrir o Caixa */}
          <div className="flex relative z-10">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shrink-0">
              <Unlock className="h-5 w-5" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium">1. Abrir o Caixa</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="step-1">
                  <AccordionTrigger className="text-sm text-muted-foreground py-2">
                    Ver detalhes
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        O primeiro passo do dia é abrir o caixa para iniciar as
                        operações.
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Clique no botão{' '}
                          <span className="font-medium text-primary">
                            Abrir Caixa
                          </span>
                        </li>
                        <li>
                          Informe o{' '}
                          <span className="font-medium">saldo inicial</span>{' '}
                          (valor disponível em dinheiro no início do dia)
                        </li>
                        <li>Opcionalmente, adicione uma observação</li>
                        <li>Confirme a abertura</li>
                      </ul>
                      <p className="mt-2 text-muted-foreground italic">
                        Após a abertura, o caixa estará pronto para registrar
                        movimentações.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Seta apontando para o próximo passo */}
          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
          </div>

          {/* Passo 2: Registrar Entradas */}
          <div className="flex relative z-10">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 text-white shrink-0">
              <ArrowUpCircle className="h-5 w-5" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium">2. Registrar Entradas</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="step-2">
                  <AccordionTrigger className="text-sm text-muted-foreground py-2">
                    Ver detalhes
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        Durante o dia, registre cada entrada de dinheiro no
                        caixa.
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Clique no botão{' '}
                          <span className="font-medium text-green-600">
                            Entrada
                          </span>
                        </li>
                        <li>
                          Informe o <span className="font-medium">valor</span>{' '}
                          recebido
                        </li>
                        <li>
                          Selecione o{' '}
                          <span className="font-medium">
                            método de pagamento
                          </span>{' '}
                          (dinheiro, cartão, PIX, etc.)
                        </li>
                        <li>
                          Adicione uma{' '}
                          <span className="font-medium">descrição</span> clara
                          (ex: "Pagamento do cliente João")
                        </li>
                        <li>
                          Selecione o <span className="font-medium">local</span>{' '}
                          da operação (loja, online, externa)
                        </li>
                      </ul>
                      <p className="mt-2 text-muted-foreground italic">
                        Cada entrada registrada será adicionada ao saldo do
                        caixa e poderá ser visualizada no painel de
                        movimentações.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Seta apontando para o próximo passo */}
          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
          </div>

          {/* Passo 3: Registrar Saídas */}
          <div className="flex relative z-10">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-destructive text-destructive-foreground shrink-0">
              <ArrowDownCircle className="h-5 w-5" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium">3. Registrar Saídas</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="step-3">
                  <AccordionTrigger className="text-sm text-muted-foreground py-2">
                    Ver detalhes
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        Registre todas as saídas de dinheiro do caixa durante o
                        dia.
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Clique no botão{' '}
                          <span className="font-medium text-destructive">
                            Saída
                          </span>
                        </li>
                        <li>
                          Informe o <span className="font-medium">valor</span>{' '}
                          que está saindo do caixa
                        </li>
                        <li>
                          Selecione o{' '}
                          <span className="font-medium">
                            método de pagamento
                          </span>{' '}
                          utilizado
                        </li>
                        <li>
                          Adicione uma{' '}
                          <span className="font-medium">
                            descrição detalhada
                          </span>{' '}
                          do motivo da saída (ex: "Pagamento fornecedor",
                          "Retirada para troco")
                        </li>
                        <li>
                          Selecione o <span className="font-medium">local</span>{' '}
                          da operação
                        </li>
                      </ul>
                      <p className="mt-2 text-muted-foreground italic">
                        Cada saída será descontada do saldo do caixa. É
                        fundamental registrar TODAS as saídas para manter o
                        controle do caixa.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Seta apontando para o próximo passo */}
          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
          </div>

          {/* Passo 4: Acompanhar Movimentações */}
          <div className="flex relative z-10">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white shrink-0">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium">
                4. Acompanhar Movimentações
              </h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="step-4">
                  <AccordionTrigger className="text-sm text-muted-foreground py-2">
                    Ver detalhes
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        Durante o dia, acompanhe as movimentações e o saldo do
                        caixa.
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Verifique o{' '}
                          <span className="font-medium">saldo atual</span> no
                          painel principal
                        </li>
                        <li>
                          Consulte as{' '}
                          <span className="font-medium">estatísticas</span> para
                          ver a distribuição de entradas e saídas
                        </li>
                        <li>
                          Confira a{' '}
                          <span className="font-medium">
                            lista de movimentações
                          </span>{' '}
                          para ter um histórico detalhado
                        </li>
                        <li>
                          Use o botão{' '}
                          <span className="font-medium">Atualizar</span> para
                          sincronizar os dados caso necessário
                        </li>
                      </ul>
                      <p className="mt-2 text-muted-foreground italic">
                        O acompanhamento frequente durante o dia ajuda a
                        identificar possíveis erros ou divergências antes do
                        fechamento.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Seta apontando para o próximo passo */}
          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
          </div>

          {/* Passo 5: Fechar o Caixa */}
          <div className="flex relative z-10">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-600 text-white shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium">5. Fechar o Caixa</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="step-5">
                  <AccordionTrigger className="text-sm text-muted-foreground py-2">
                    Ver detalhes
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p>Ao final do dia, realize o fechamento do caixa.</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Clique no botão{' '}
                          <span className="font-medium">Fechar Caixa</span>
                        </li>
                        <li>
                          O sistema mostrará o{' '}
                          <span className="font-medium">saldo calculado</span>{' '}
                          com base nas movimentações registradas
                        </li>
                        <li>
                          Conte o dinheiro físico no caixa e informe o{' '}
                          <span className="font-medium">
                            saldo final confirmado
                          </span>
                        </li>
                        <li>
                          Se houver{' '}
                          <span className="font-medium">divergência</span> entre
                          o valor calculado e o valor real, o sistema destacará
                          a diferença
                        </li>
                        <li>
                          Adicione uma{' '}
                          <span className="font-medium">observação</span>{' '}
                          explicando eventuais divergências
                        </li>
                        <li>Confirme o fechamento</li>
                      </ul>
                      <p className="mt-2 text-muted-foreground italic">
                        Após o fechamento, o caixa ficará indisponível para
                        novas movimentações até a próxima abertura. Um relatório
                        de fechamento será gerado automaticamente.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Seta apontando para o próximo passo */}
          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
          </div>

          {/* Passo 6: Consultar Histórico */}
          <div className="flex relative z-10">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-600 text-white shrink-0">
              <History className="h-5 w-5" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium">6. Consultar Histórico</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="step-6">
                  <AccordionTrigger className="text-sm text-muted-foreground py-2">
                    Ver detalhes
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        Quando necessário, consulte o histórico de caixas
                        anteriores.
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Acesse a aba{' '}
                          <span className="font-medium">Histórico</span> no
                          painel principal
                        </li>
                        <li>
                          Use os{' '}
                          <span className="font-medium">filtros de data</span>{' '}
                          para localizar caixas específicos
                        </li>
                        <li>
                          Pesquise por{' '}
                          <span className="font-medium">operador</span> ou
                          outros termos específicos
                        </li>
                        <li>
                          Clique no botão de{' '}
                          <span className="font-medium">visualizar</span> para
                          ver detalhes de um caixa específico
                        </li>
                        <li>
                          Gere <span className="font-medium">relatórios</span>{' '}
                          para análise e controle financeiro
                        </li>
                      </ul>
                      <p className="mt-2 text-muted-foreground italic">
                        O histórico completo permite análises financeiras,
                        acompanhamento de tendências e verificação de operações
                        passadas.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-accent rounded-lg text-muted-foreground">
          <h4 className="font-medium mb-2 flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Dicas importantes:
          </h4>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>
              <span className="font-medium">
                Registre todas as movimentações
              </span>{' '}
              - Qualquer entrada ou saída de dinheiro deve ser registrada, por
              menor que seja
            </li>
            <li>
              <span className="font-medium">Confira periodicamente</span> -
              Durante o dia, verifique se o saldo físico corresponde ao saldo do
              sistema
            </li>
            <li>
              <span className="font-medium">
                Seja detalhista nas descrições
              </span>{' '}
              - Descrições claras ajudam na análise posterior
            </li>
            <li>
              <span className="font-medium">Sempre feche o caixa</span> - Nunca
              deixe o caixa aberto entre um dia e outro
            </li>
            <li>
              <span className="font-medium">Backup de segurança</span> - Em caso
              de falha no sistema, registre as operações em papel até que o
              sistema volte
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
