import MenuDashboard from "../../component/menu-dashboard/MenuDashboard";
import ClientList from "../../component/client-list/ClientList";

export default function DashboardClientList() {
    return <div>
        < MenuDashboard />
        <div>
            < ClientList />
        </div>
    </div>;
}