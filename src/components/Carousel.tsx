import { useState, useRef, useId, useEffect, useCallback } from "react";


interface SlideProps {
  slide: string;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };


  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[50vmin] h-[50vmin] mx-[4vmin] z-10 "
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[5%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-600 ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
            alt={'Embarcação'}
            src={slide}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
        </div>
      </li>
    </div>
  );
};

interface CarouselProps {
  slides: string[];
  autoplay?: boolean; // Adicionado autoplay como prop
  autoplayDelay?: number; // Tempo do autoplay em ms
  pauseOnHover?: boolean; // Se deve pausar no hover
  itemWidthValue?: string; // Ex: '70vmin'
  itemMarginValue?: string;
}

export function Carousel({ slides, autoplay = true, // Definindo padrão como true
  autoplayDelay = 3000,
  pauseOnHover = true, }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null); // Ref para o contêiner do carrossel
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref para armazenar o ID do timer
  const isHovered = useRef(false);

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  // --- Lógica de Autoplay e Hover Pause ---
    const startAutoplayTimer = useCallback(() => {
      // Limpa qualquer timer existente antes de iniciar um novo
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
  
      if (autoplay && !isHovered.current) {
        // Só inicia se autoplay estiver ativo E não estiver em hover
        timerRef.current = setInterval(() => {
          handleNextClick();
        }, autoplayDelay);
      }
    }, [autoplay, autoplayDelay, handleNextClick]);
  
    const pauseAutoplayTimer = useCallback(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current); // Pausa o timer limpando-o
        timerRef.current = null; // Zera a referência
      }
    }, []);
  
    // Efeito para iniciar/parar o autoplay
    useEffect(() => {
      startAutoplayTimer(); // Inicia o timer na montagem ou quando dependências mudam
  
      return () => {
        // Limpa o timer quando o componente é desmontado
        pauseAutoplayTimer();
      };
    }, [startAutoplayTimer, pauseAutoplayTimer]);

  return (
    <div
    ref={carouselRef}
      className="relative w-[50vmin] h-[50vmin] mx-auto"
      aria-labelledby={`carousel-heading-${id}`}
       onMouseEnter={() => {
        // Eventos de hover no contêiner do carrossel
        if (pauseOnHover) {
          isHovered.current = true;
          pauseAutoplayTimer();
        }
      }}
      onMouseLeave={() => {
        if (pauseOnHover) {
          isHovered.current = false;
          startAutoplayTimer();
        }
      }}
    >
      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

       {/* Indicadores de bolinha (dots) */}
      <div className="flex w-full justify-center absolute bottom-[-15px] md:bottom-[-20px]">
        <div className="mt-4 flex w-[150px] justify-between px-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                current === index ? "bg-secondary" : "bg-primary"
              }`}
              style={{
                transform: current === index ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.15s ease-out",
              }}
              onClick={() => handleSlideClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
