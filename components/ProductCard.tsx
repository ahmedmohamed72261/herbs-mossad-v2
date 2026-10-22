import { FC } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { getAssetUrl } from '@/lib/api';
import { useAppStore } from '@/store';

interface ProductCardProps {
  id: number | string;
  name: string;
  category: string;
  description: string;
  image: string | null;
  isFeatured?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  category,
  description,
  image,
  isFeatured = false,
}) => {
  const { language } = useAppStore();
  const isEn = language === 'en';
  const imageUrl = image ? getAssetUrl(image) : null;

  return (
    <article className="card-organic group">
      <div className="img-frame relative m-3 h-[220px] rounded-[16px]">
        {isFeatured && (
          <span className="tag-sale ltr:!left-4 rtl:!right-4 !top-4">
            {isEn ? 'Featured' : 'مميز'}
          </span>
        )}

        <Link href={`/products/${id}`} className="block h-full w-full">
          {imageUrl ? (
            <img src={imageUrl} alt={name} />
          ) : (
            <span className="grid h-full w-full place-items-center bg-[#F6F4EC] text-5xl">🌿</span>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-2">
        <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#A5C232]">
          {category}
        </span>
        <h3 className="mt-2 font-display text-[19px] font-bold capitalize leading-snug text-[#0D1615] dark:text-white">
          <Link href={`/products/${id}`} className="transition hover:text-[#A5C232]">
            {name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-grow text-[15px] leading-[1.8] text-[#5E5E5E] dark:text-white/60">
          {description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E2E2E2] pt-4 dark:border-white/10">
          <Link
            href="/contact"
            className="rounded-[10px] bg-[#A5C232] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#0D1615]"
          >
            {isEn ? 'Request Quote' : 'طلب عرض سعر'}
          </Link>
          <Link
            href={`/products/${id}`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-[#E2E2E2] text-[#0D1615] transition hover:border-[#0D1615] dark:border-white/15 dark:text-white"
            aria-label={isEn ? 'View details' : 'عرض التفاصيل'}
          >
            <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
