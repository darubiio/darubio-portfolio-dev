import type { StaticImageData } from "next/image";
import perdomoWarehouses from "../../public/assets/perdomo-warehouses.png";
import perdomoInventory from "../../public/assets/perdomo-inventory.png";
import perdomoReceiving from "../../public/assets/perdomo-receiving.png";
import billrootInvoices from "../../public/assets/billroot-invoices.png";
import billrootRecurring from "../../public/assets/billroot-recurring.png";
import billrootDetail from "../../public/assets/billroot-detail.png";
import billrootEdit from "../../public/assets/billroot-edit.png";

export const SCREENSHOTS: Record<string, StaticImageData> = {
  "assets/perdomo-warehouses.png": perdomoWarehouses,
  "assets/perdomo-inventory.png": perdomoInventory,
  "assets/perdomo-receiving.png": perdomoReceiving,
  "assets/billroot-invoices.png": billrootInvoices,
  "assets/billroot-recurring.png": billrootRecurring,
  "assets/billroot-detail.png": billrootDetail,
  "assets/billroot-edit.png": billrootEdit,
};
