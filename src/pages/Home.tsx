import litoral from "../assets/litoral.png";
import proa from "../assets/proa barco.png";
import saoSeba from "../assets/sao seba.png";
import ilhabela from "../assets/ilhabela.png";
import ubatuba from "../assets/ubatuba.png";
import caragua from "../assets/caragua.png";
import ButtonDefault from "../components/ButtonDefault";
import { useNavigate } from "react-router-dom";
import DividerComponent from "../components/DividerComponent";

const Home = () => {
  const navigate = useNavigate();

  const navigateTo = (city: string | null) => {
    if (city) {
      navigate(`/embarcacoes?city=${city}`);
      return;
    } else navigate(`/embarcacoes`);
  };

  return (
    <>
      <div
        className="bg-cover bg-center bg-no-repeat w-screen h-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${litoral})` }}
      >
        <div className="bg-[#ffffff57] p-4 w-fit h-fit rounded-3xl flex flex-col gap-6 flex flex-col items-center justify-center ">
          <div className="flex gap-2 justify-center ">
            <p className="text-primary text-5xl lg:text-7xl">A BORDO</p>
            <p className="text-secondary text-5xl lg:text-7xl">LN</p>
          </div>
          <p className="text-primary text-3xl lg:text-5xl text-center">
            O mapa da sua próxima aventura
          </p>
          <div className="w-[350px] max-w-90 flex items-center justify-center">
            <ButtonDefault text={"Barcos"} action={() => navigateTo(null)} />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center max-w-90 lg:max-w-7xl mx-auto py-8 mt-10">
        <p className="text-center text-primary text-3xl lg:text-4xl">
          Conheça a praias mais bonitas do litoral norte de SP
        </p>
        <p className="text-center text-black text-1xl lg:text-2xl mt-6 text-justify">
          Prepare-se para descobrir um paraíso escondido! O Litoral Norte de São
          Paulo é um tesouro de paisagens deslumbrantes, com praias que encantam
          por sua beleza natural, águas cristalinas e tranquilidade. De enseadas
          intocadas a ilhas paradisíacas, cada canto guarda uma aventura à
          espera de ser explorada. Com A Bordo LN, essa jornada é realizada
          pelos melhores operadores de passeios de barco e lancha da região.
          Trabalhamos lado a lado com parceiros selecionados, que conhecem cada
          segredo do Litoral Norte e garantem experiências seguras e
          inesquecíveis. Nossa plataforma é o mapa que conecta você aos
          verdadeiros mestres do mar, que levarão você e sua família aos
          destinos mais espetaculares. Navegue por roteiros exclusivos, encontre
          a lancha ou escuna ideal e mergulhe em momentos que vão além do comum.
          Seja para relaxar em praias desertas, praticar snorkel em piscinas
          naturais ou simplesmente contemplar o pôr do sol em alto mar, nossos
          parceiros estão prontos para te levar a bordo.
        </p>

        <div className="w-full h-full flex items-center justify-center mt-16">
          <img src={proa} alt="São Sebastião" className="rounded-3xl" />
        </div>
      </div>
      <div className="w-full flex flex-col items-center max-w-90 lg:max-w-7xl mx-auto py-8">
        <p className="text-center text-primary text-4xl lg:text-5xl mt-4">
          Cidades do nosso litoral
        </p>
        <div className="mt-8 w-full flex flex-col items-center gap-8 mb-8">
          <p className="text-center text-primary text-2xl lg:text-4xl">
            São Sebastião: História, Charme e Ilhas Paradisíacas
          </p>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex items-center justify-center ">
              <img
                src={saoSeba}
                alt="São Sebastião"
                className="rounded-3xl w-full max-w-lg md:max-w-none"
              />
            </div>

            <p className="text-center text-black text-base lg:text-lg mt-6 md:mt-0 text-justify">
              São Sebastião é uma cidade de contrastes, onde a história colonial
              se mistura à modernidade de suas praias. No centro, ruas charmosas
              e casarões antigos contam a rica trajetória da cidade. Mas é em
              suas praias que a aventura começa: desde a badalada Maresias, com
              suas ondas perfeitas para o surf, até a tranquilidade de Juquehy e
              a beleza rústica de Barra do Sahy. Passeios de barco em São
              Sebastião revelam um universo à parte. É do mar que se alcançam
              ilhas paradisíacas como a Ilha das Couves, com suas piscinas
              naturais de águas cristalinas, e a Ilha Montão de Trigo, um
              refúgio para mergulhadores. Nossos parceiros oferecem roteiros que
              exploram grutas escondidas, enseadas secretas e os melhores pontos
              para snorkel, permitindo que você descubra a verdadeira essência
              deste litoral, acessível apenas pela água.
            </p>
          </div>
          <div className="w-[350px] max-w-90 flex items-center justify-center">
            <ButtonDefault
              text={"Conhecer"}
              action={() => navigateTo("São Sebastião")}
            />
          </div>
        </div>
        <DividerComponent />
        <div className="mt-8 w-full flex flex-col items-center gap-8 mb-8">
          <p className="text-center text-primary text-2xl lg:text-4xl">
            Ilhabela: A Capital da Vela e Seus Segredos Marinhos
          </p>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <p className="text-center order-2 lg:order-1 text-black text-base lg:text-lg mt-6 md:mt-0 text-justify">
              Ilhabela é um arquipélago lendário, um paraíso para os amantes da
              natureza e dos esportes náuticos. Com mais de 40 praias e
              cachoeiras, sua paisagem é de tirar o fôlego. Praias como a de
              Castelhanos, com sua beleza selvagem e acesso desafiador por
              terra, e a movimentada Praia do Curral, com suas opções de lazer,
              são apenas um aperitivo do que a ilha oferece. A bordo de uma
              lancha ou escuna em Ilhabela, você desvenda os segredos mais bem
              guardados da ilha. Explore as praias do lado leste, famosas por
              sua preservação e difícil acesso terrestre. Mergulhe em santuários
              marinhos como o Santuário Ecológico da Ilha das Cabras, observe a
              rica vida marinha e desfrute de paisagens que parecem pintadas à
              mão. Passeios de barco são a chave para conhecer o verdadeiro
              espírito aventureiro de Ilhabela, proporcionando vistas
              panorâmicas e acessos exclusivos que de outra forma seriam
              impossíveis.
            </p>
            <div className="flex order-1 lg:order-2 items-center justify-center ">
              <img src={ilhabela} alt="Ilhabela" className="rounded-3xl" />
            </div>
          </div>
          <div className="w-[350px] max-w-90 flex items-center justify-center">
            <ButtonDefault
              text={"Conhecer"}
              action={() => navigateTo("Ilhabela")}
            />
          </div>
        </div>
        <DividerComponent />
        <div className="mt-8 w-full flex flex-col items-center gap-8 mb-8">
          <p className="text-center text-primary text-2xl lg:text-4xl">
            Ubatuba: O Paraíso das Águas Claras e da Mata Atlântica
          </p>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex items-center justify-center ">
              <img src={ubatuba} alt="Ubatuba" className="rounded-3xl" />
            </div>
            <p className="text-center text-black text-base lg:text-lg mt-6 md:mt-0 text-justify">
              Conhecida como a capital do surf e do ecoturismo, Ubatuba
              impressiona pela quantidade e diversidade de suas praias – são
              mais de cem! Desde a urbanizada Praia Grande, com sua
              infraestrutura completa, até a calma e familiar Praia do Lázaro,
              Ubatuba agrada a todos os gostos. Mas são as praias acessíveis por
              barco que realmente roubam a cena. Passeios de barco em Ubatuba
              são um mergulho em um paraíso de águas claras e Mata Atlântica
              preservada. Descubra joias como a Ilha das Couves, com suas
              piscinas naturais intocadas, a Ilha do Prumirim, com suas águas
              calmas e areia branca, e a Ilha Anchieta, um parque estadual com
              trilhas e ruínas históricas. Nossos operadores parceiros guiam
              você por roteiros que oferecem mergulho livre, momentos de
              relaxamento em praias desertas e a chance de avistar a rica fauna
              marinha da região, transformando seu dia em uma verdadeira
              expedição de descoberta.
            </p>
          </div>
          <div className="w-[350px] max-w-90 flex items-center justify-center">
            <ButtonDefault
              text={"Conhecer"}
              action={() => navigateTo("Ubatuba")}
            />
          </div>
        </div>
        <DividerComponent />
        <div className="mt-8 w-full flex flex-col items-center gap-8">
          <p className="text-center text-primary text-2xl lg:text-4xl">
            Caraguatatuba: Praias Urbanas e Tesouros Escondidos na Costa
          </p>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <p className="text-center order-2 lg:order-1 text-black text-base lg:text-lg mt-6 md:mt-0 text-justify">
              Caraguatatuba, ou simplesmente Caraguá, é uma cidade acolhedora
              que oferece uma combinação perfeita de praias urbanizadas e
              trechos mais selvagens. Praias como a Martim de Sá e a Praia da
              Cocanha são ideais para famílias, com suas águas calmas e boa
              infraestrutura. No entanto, a verdadeira magia de Caraguatatuba se
              revela quando se explora sua costa pelo mar. De barco em
              Caraguatatuba, você pode alcançar praias e ilhas que oferecem uma
              experiência de contato mais íntimo com a natureza. Descubra
              enseadas tranquilas, pratique stand-up paddle ou caiaque em águas
              serenas e observe a vida marinha em pontos menos explorados.
              Nossos parceiros oferecem roteiros que levam a locais como a Ilha
              do Tamanduá, com suas formações rochosas e beleza cênica, e praias
              mais isoladas que são verdadeiros refúgios para quem busca paz e
              exclusividade. A perspectiva do mar em Caraguá permite ver a
              cidade de um novo ângulo, revelando seus tesouros mais escondidos
              e as paisagens mais pitorescas da sua costa.
            </p>
            <div className="flex order-1 lg:order-2 items-center justify-center ">
              <img src={caragua} alt="Caragutatuba" className="rounded-3xl" />
            </div>
          </div>
          <div className="w-[350px] max-w-90 flex items-center justify-center">
            <ButtonDefault
              text={"Conhecer"}
              action={() => navigateTo("Caraguatatuba")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
