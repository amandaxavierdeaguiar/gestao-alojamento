import MenuDashboard from "../../component/menu-dashboard/MenuDashboard";
import RoomList from "../../component/room-list/RoomList";

export default function DashboardClientList() {
    return <div>
        < MenuDashboard />
        <div>
            < RoomList />
        </div>
    </div>;
}