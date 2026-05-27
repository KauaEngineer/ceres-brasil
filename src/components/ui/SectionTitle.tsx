interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Titulo padrao de secao: pequeno "eyebrow" colorido em cima,
 * titulo grande e uma descricao opcional logo abaixo.
 */
export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}: SectionTitleProps) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ceres-gold">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-light tracking-tight text-ceres-dark md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-ceres-muted md:text-lg">{description}</p>
      )}
    </div>
  );
}
