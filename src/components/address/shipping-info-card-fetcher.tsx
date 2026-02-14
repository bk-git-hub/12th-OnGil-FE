import { getAddresses } from '@/app/actions/address';
import ShippingInfoCard from './shipping-info-card';

interface ShippingInfoCardFetcherProps {
  title?: string;
  className?: string;
}

export default async function ShippingInfoCardFetcher({
  title,
  className,
}: ShippingInfoCardFetcherProps) {
  const addresses = await getAddresses();
  const defaultAddress = addresses.find((item) => item.isDefault) || null;

  return (
    <ShippingInfoCard
      address={defaultAddress}
      title={title}
      className={className}
    />
  );
}
