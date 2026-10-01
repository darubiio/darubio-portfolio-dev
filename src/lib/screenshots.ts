import type { StaticImageData } from "next/image";
import perdomoWarehouses from "../../public/assets/perdomo-warehouses.webp";
import perdomoInventory from "../../public/assets/perdomo-inventory.webp";
import perdomoReceiving from "../../public/assets/perdomo-receiving.webp";
import billrootInvoices from "../../public/assets/billroot-invoices.webp";
import billrootRecurring from "../../public/assets/billroot-recurring.webp";
import billrootDetail from "../../public/assets/billroot-detail.webp";
import billrootEdit from "../../public/assets/billroot-edit.webp";

export const SCREENSHOTS: Record<string, StaticImageData> = {
  "assets/perdomo-warehouses.webp": perdomoWarehouses,
  "assets/perdomo-inventory.webp": perdomoInventory,
  "assets/perdomo-receiving.webp": perdomoReceiving,
  "assets/billroot-invoices.webp": billrootInvoices,
  "assets/billroot-recurring.webp": billrootRecurring,
  "assets/billroot-detail.webp": billrootDetail,
  "assets/billroot-edit.webp": billrootEdit,
};
