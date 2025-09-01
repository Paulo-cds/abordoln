
import { useEffect, type RefObject } from 'react';

function useClickOutside(ref: RefObject<HTMLElement> | null, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: Event) => { 
      const targetNode = event.target as Node; 
      if (!ref || !ref.current || ref.current.contains(targetNode)) {
        return;
      }
      handler(event as MouseEvent | TouchEvent); // <<-- Faz um cast aqui para o handler
    };

    // Adiciona o event listener ao documento inteiro
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      // Remove o event listener quando o componente é desmontado
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default useClickOutside;