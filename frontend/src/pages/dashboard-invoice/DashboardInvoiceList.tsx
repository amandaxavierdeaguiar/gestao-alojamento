import MenuDashboard from "../../component/menu-dashboard/MenuDashboard";
import InvoiceList from "../../component/invoice/InvoiceList";

export default function DashboardClientList() {
    return <div>
        < MenuDashboard />
        <div>
            < InvoiceList />
        </div>
    </div>;
}