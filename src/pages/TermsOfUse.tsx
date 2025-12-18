export default function TermsOfUse() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Termos de Uso – A Bordo LN
      </h1>
      <p className="mb-6">
        <strong>Última atualização:</strong> 30 de setembro de 2025
      </p>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">1. Definições</h2>
          <p>
            <strong>Plataforma / Serviço:</strong> o site/plataforma da A Bordo
            LN para intermediação de locações de embarcações e afins.
            <br />
            <strong>Usuário:</strong> pessoa física ou jurídica que acessa a
            plataforma, seja como cliente (locatário) ou anunciante
            (proprietário/investidor).
            <br />
            <strong>Locador / Anunciante:</strong> usuário que anuncia
            embarcação e/ou serviços para locação.
            <br />
            <strong>Locatário / Cliente:</strong> usuário que contrata a locação
            via plataforma.
            <br />
            <strong>Reserva:</strong> ato de reservar um serviço embarcado via A
            Bordo LN.
            <br />
            <strong>Pagamento / Cobrança:</strong> valores pagos via Stripe ou
            outros meios integrados para efetivar a locação.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">2. Cadastro e Conta</h2>
          <p>
            Para usar os serviços de reserva e anúncio, é necessário criar uma
            conta com email válido, senha e demais dados solicitados. Você é
            responsável por manter seus dados atualizados e a confidencialidade
            da senha. Não é permitido compartilhar contas entre pessoas
            diferentes.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">3. Uso da Plataforma</h2>
          <p>
            A plataforma atua como intermediadora entre Locador e Locatário; não
            é proprietária das embarcações oferecidas. A Bordo LN não garante
            que todos os anúncios sejam legítimos. É proibido o uso da
            plataforma para atividades ilegais, fraudulentas ou que violem estes
            Termos.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            4. Reserva, Pagamento e Cancelamento
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Ao solicitar uma reserva esta não é confirmada automaticamente. O
              Locador deve aprovar a solicitação conforme disponibilidade e
              critérios próprios.
            </li>
            <li>
              No ato da solicitação da reserva o Locatário deve inserir dados de
              cartão de crédito válidos. A cobrança não é feita neste momento,
              apenas a autorização para futura cobrança em caso de cancelamento
              tardio ou não comparecimento.
            </li>
            <li>
              O pagamento da reserva será efetuado via pix ao Locador após o
              término da locação, conforme valores e condições acordadas no
              anúncio.
            </li>
            <li>
              Taxas extras poderão ser cobradas pelo Locador por eventuais danos
              causados à embarcação ou descumprimento de regras. Tais cobranças
              deverão ser comunicadas ao Locatário ao final da locação, com
              detalhamento e comprovação. Ambos deverão entrar em comum acordo
              para que a cobrança seja efetuada.
            </li>
            <li>
              Em caso de cancelamento da reserva pelo Locatário, as seguintes
              regras se aplicam:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  Cancelamentos feitos com mais de 48 horas de antecedência não
                  acarretarão cobranças.
                </li>
                <li>
                  Cancelamentos feitos com menos de 48 horas de antecedência
                  acarretarão a cobrança de 40% do valor total da reserva.
                </li>
                <li>
                  O não comparecimento sem aviso prévio será considerado como
                  cancelamento tardio, sujeitando-se à cobrança de 100% do valor
                  da reserva.
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            5. Direitos e Obrigações dos Usuários
          </h2>
          <p className="mb-2 font-semibold">Locatário / Cliente:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              O Locatário declara-se único responsável perante a A Bordo LN por
              qualquer dano ou infração cometida por ele ou por pessoas que
              estarão a bordo, respondendo administrativa, civil e penalmente
              pelos atos de seus convidados, tripulantes e funcionários.
            </li>
            <li>
              O Locatário deve verificar o estado da embarcação, a validade de
              inspeções técnicas, a presença a bordo de sistema de segurança
              apropriado para a categoria de navegação e a atualização dos
              equipamentos antes da assinatura do contrato de locação.
            </li>
            <li>
              O Locatário deve possuir todos os documentos, habilitações e
              qualificações exigidos pela legislação para a condução da
              embarcação, bem como respeitar o limite máximo de pessoas a bordo
              indicado pelo sistema de segurança.
            </li>
            <li>
              O Locatário deve orientar seus convidados de que é terminantemente
              proibido acionar comandos da embarcação (motores, chaves, botões,
              disjuntores, manetes, direção, etc.), cujo uso é exclusivo do
              capitão ou marinheiro, sob pena de ressarcimento integral de
              eventuais danos.
            </li>
            <li>
              O Locatário é responsável por pagar imediatamente quaisquer
              multas, taxas ou penalidades decorrentes de infrações cometidas
              durante a locação, quando solicitado pelo proprietário da
              embarcação.
            </li>
            <li>
              O Locatário deve utilizar a embarcação de forma responsável e
              exclusivamente para navegação de recreio, sendo vedada qualquer
              atividade comercial, pesca profissional, transporte de carga,
              reboque ou outras operações não previstas no contrato.
            </li>
            <li>
              O Locatário deve devolver a embarcação nas mesmas condições de
              conservação em que a recebeu, limpa, com todos os equipamentos e
              dentro do prazo estipulado, sob pena de cobrança de taxas
              adicionais ou indenizações.
            </li>
            <li>
              O Locatário deve cumprir todas as condições de locação
              estabelecidas pelo proprietário, bem como todas as regulamentações
              locais e nacionais aplicáveis à navegação.
            </li>
            <li>
              O Locatário deverá comparecer no horário combinado para devolução
              da embarcação, sob pena de pagamento de valor adicional por
              atraso, conforme estipulado no anúncio ou contrato.
            </li>
            <li>
              É de responsabilidade do Locatário revisar a apólice de seguro do
              aluguel, compreendendo suas exclusões, franquias e limites de
              cobertura.
            </li>
            <li>
              O Locatário é responsável pelo uso adequado da embarcação, de seus
              utensílios, eletrodomésticos e eletrônicos, devendo ressarcir
              perdas, danos ou quebras decorrentes de mau uso. Situações como
              entupimentos, sujeiras excessivas, decorações de festas ou outras
              ocorrências poderão gerar cobrança de taxa extra estipulada pelo
              Locador.
            </li>
            <li>
              O Locatário é responsável por seus pertences e dos demais
              passageiros, devendo retirar todos os objetos pessoais ao final da
              locação. Nem o Locador nem a A Bordo LN se responsabilizam por
              itens esquecidos na embarcação.
            </li>
            <li>
              Em locações de JET SKI, o usuário que fizer a reserva deverá
              apresentar habilitação náutica adequada (por exemplo, Arrais
              Amador) e será o único autorizado a conduzir a embarcação, sendo
              proibida a condução por terceiros por questões de segurança.
            </li>
          </ul>
          <p className="mb-2 font-semibold">Locador / Anunciante:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              O Locador se compromete a oferecer apenas embarcações que possuam
              seguro vigente para as atividades de locação, independentemente da
              área de navegação planejada.
            </li>
            <li>
              O Locador deve informar no anúncio ou contrato eventuais
              limitações ou condições da apólice de seguro.
            </li>
            <li>
              O Locador assume integralmente os riscos da atividade de locação
              em caso de danos não cobertos pelo seguro, isentando a A Bordo LN
              de qualquer responsabilidade.
            </li>
            <li>
              O Locador deve verificar a identidade do Locatário antes do
              embarque, podendo exigir documentos e habilitações pertinentes.
            </li>
            <li>
              O Locador não deve publicar informações falsas, enganosas ou
              oferecer embarcações que não possua ou para as quais não tenha
              autorização de locação.
            </li>
            <li>
              O Locador não deve divulgar dados pessoais de terceiros sem
              consentimento, incluindo fotos, contatos ou informações de
              pagamento.
            </li>
            <li>
              O Locador é responsável por cumprir todas as exigências legais e
              regulamentares do Tribunal Marítimo e órgãos competentes, podendo
              disponibilizar a embarcação sem marinheiro apenas quando o
              Locatário possuir habilitação adequada, cabendo exclusivamente ao
              Locador avaliar e autorizar a locação.
            </li>
            <li>
              O Locador se compromete a garantir que a embarcação esteja em
              perfeitas condições de segurança, limpeza e funcionamento no
              momento da entrega ao Locatário.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            6. Cobranças e Transferências
          </h2>
          <p>
            A Bordo LN utiliza Stripe ou outro provedor para processar
            pagamentos e transferir parcelas aos Locadores. O prazo padrão para
            liberação de valores é de até 30 dias, salvo previsão em contrário.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            7. Política de Reembolso / Disputas
          </h2>
          <p>
            Em caso de problemas, o usuário deve abrir disputa via plataforma. A
            Bordo LN mediará a questão e poderá reembolsar total ou parcialmente
            conforme avaliação. Reembolsos serão feitos no mesmo meio de
            pagamento utilizado.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            8. Propriedade Intelectual
          </h2>
          <p>
            Todo conteúdo da plataforma é de propriedade da A Bordo LN ou
            utilizado com licença. É proibida a reprodução ou exploração sem
            autorização.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            9. Limitação de Responsabilidade
          </h2>
          <p>
            A Bordo LN não é responsável por incidentes durante a locação, como
            avarias, furtos, danos pessoais ou ambientais, atuando apenas como
            intermediária.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            10. Suspensão / Encerramento
          </h2>
          <p>
            A Bordo LN pode suspender ou encerrar contas que violem estes
            Termos. Usuários podem encerrar suas contas a qualquer momento,
            observando reservas ativas.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">11. Alterações</h2>
          <p>
            A Bordo LN pode alterar estes Termos a qualquer momento. As
            alterações entram em vigor após publicação na plataforma.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            12. Disposições Gerais
          </h2>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do
            Brasil. Fica eleito o foro da comarca de Ilhabela/SP, salvo
            disposição legal em contrário.
          </p>
        </div>
      </section>
    </div>
  );
}
