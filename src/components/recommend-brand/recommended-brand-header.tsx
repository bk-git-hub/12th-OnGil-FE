import { Brand } from '@/types/products';

interface Props {
  brands: Brand[];
  onClick: (index: number) => void;
  selectedIndex: number;
}

export default function RecommendedBrandHeader({
  brands,
  onClick,
  selectedIndex,
}: Props) {
  return (
    <div className="flex w-full text-white">
      {brands.map((brand, index) => {
        const isSelected = index === selectedIndex;

        const baseStyle = 'flex-1 py-2 transition-colors duration-200';
        const selectedStyle = 'bg-ongil-teal font-bold';
        const unselectedStyle = 'bg-gray-200 text-gray-500 hover:bg-gray-300';

        const radiusStyle =
          index === 0
            ? 'rounded-l-2xl'
            : index === brands.length - 1
              ? 'rounded-r-2xl'
              : '';

        return (
          <button
            key={brand.id || index} // Use unique ID if available, fallback to index
            onClick={() => onClick(index)}
            className={`${baseStyle} ${radiusStyle} ${isSelected ? selectedStyle : unselectedStyle}`}
          >
            {brand.name}
          </button>
        );
      })}
    </div>
  );
}
