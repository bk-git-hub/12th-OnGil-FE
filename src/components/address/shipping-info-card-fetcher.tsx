import { getAddresses, getMyAddress } from '@/app/actions/address';
import ShippingInfoCard from './shipping-info-card';

interface ShippingInfoCardFetcherProps {
  title?: string;
  className?: string;
  actionHref?: string;
  actionLabel?: string;
}

export default async function ShippingInfoCardFetcher({
  title,
  className,
  actionHref,
  actionLabel,
}: ShippingInfoCardFetcherProps) {
  const [addresses, myAddress] = await Promise.all([
    getAddresses(),
    getMyAddress().catch(() => null),
  ]);

  const defaultAddress = addresses.find((item) => item.isDefault) || null;
  const resolvedDefaultAddress =
    defaultAddress &&
    myAddress?.hasShippingInfo &&
    myAddress.shippingDetail.addressId === defaultAddress.addressId
      ? {
          ...defaultAddress,
          deliveryRequest:
            myAddress.shippingDetail.deliveryRequest ||
            defaultAddress.deliveryRequest,
        }
      : defaultAddress;

  return (
    <ShippingInfoCard
      address={resolvedDefaultAddress}
      title={title}
      className={className}
      actionHref={actionHref}
      actionLabel={actionLabel}
    />
  );
}
