/**
 * Botao flutuante de WhatsApp — fixo no canto inferior direito de todas as paginas.
 * Renderizado no layout global. Apenas link, nao precisa de JS — server component.
 */
import { BRAND, whatsappLink } from '@/lib/brand';

export function WhatsAppFloating() {
  return (
    <a
      href={whatsappLink(`Olá! Vim pelo site da ${BRAND.nome}.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Sua Marca no WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-110 md:bottom-6 md:right-6 md:h-16 md:w-16"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 md:h-8 md:w-8" aria-hidden="true">
        <path d="M17.5 14.4l-2-1c-.3-.1-.5-.2-.8.2l-1 1.4c-.3.3-.4.4-.8.2-2-1-3.4-2.4-4.4-4.4-.2-.3-.1-.5.2-.7l1-.9c.3-.3.2-.6.1-.9l-1-2c-.3-.5-.5-.5-.9-.5-.2 0-.5-.1-.8-.1-.3 0-.7.1-1 .5-.5.5-1.5 1.5-1.5 3.6 0 2.2 1.6 4.3 1.8 4.6.3.3 3.1 5 7.7 7 1.1.5 2 .8 2.6 1 .8.3 1.6.2 2.2.2.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.2-.8-.4M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.4c1.4.7 3 1.1 4.7 1.1 5.5 0 10-4.5 10-10S17.5 2 12 2" />
      </svg>
    </a>
  );
}
