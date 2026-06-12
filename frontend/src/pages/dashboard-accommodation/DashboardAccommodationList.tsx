import MenuDashboard from "../../component/menu-dashboard/MenuDashboard";
import AccommodationList from "../../component/accomodation-list/AccommodationList";

export default function DashboardAccommodationList() {
    return <div>
        < MenuDashboard />
        <div>
            < AccommodationList />
        </div>
    </div>;
}