import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import CreateTrack from "../pages/CreateTrack";
import EditTrack from "../pages/EditTrack";
import TracksList from "../pages/TracksList";
import {FilterProvider} from "../store/filters-context";


export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;
  const backgroundLocation = state?.backgroundLocation;

  const isCreateModal = location.pathname === "/tracks/create";
  const isEditModal = location.pathname.startsWith("/tracks/edit");
  const is404 = !(
    location.pathname.startsWith("/tracks/edit") ||
    location.pathname === "/tracks/create" ||
    location.pathname === "/tracks"
  );

  return (
    <FilterProvider>
      {!is404 && <TracksList />}
      {backgroundLocation && (isCreateModal || isEditModal) && (
        <Modal onClose={() => navigate(-1)}>
          {isCreateModal && <CreateTrack />}
          {isEditModal && <EditTrack />}
        </Modal>
      )}

      {!backgroundLocation && isCreateModal && <CreateTrack />}
      {!backgroundLocation && isEditModal && <EditTrack />}

      <Outlet />
    </FilterProvider>
  );
}
