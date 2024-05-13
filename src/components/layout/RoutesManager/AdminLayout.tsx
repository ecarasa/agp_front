import _ from 'lodash';
import { Navigate, Route, Routes } from 'react-router-dom';
import AddMovement from '../../GiroDetailContainer/Movements/AddMovement';
import AdministracionIndex from '../../../pages/ServiciosALaNave/Administracion/AdministracionIndex';
import AdminRoles from '../../../pages/AdminRoles/RolesIndex';
import BuquesCertificates from '../../../pages/Buques/Certificates';
import BuquesIndex from '../../../pages/Buques/BuquesIndex';
import BuquesSave from '../../../pages/Buques/BuquesSave';
import CartaPorteDetail from '../../../pages/CartasDePorte/CartaPorteDetail';
import CartaPorteSave from '../../../pages/CartasDePorte/CartaPorteSave';
import CartasPorteFormacion from '../../../pages/FormacionesFerroviarias/CartasPorteFormacion';
import CartasPorteIndex from '../../../pages/CartasDePorte/CartasPorteIndex';
import CertificatesHistory from '../../../pages/Buques/components/CertificatesHistory/CertificatesHistory';
import ComunicacionesDataForm from '../../../pages/Comunicaciones/components/ComunicacionDataForm';
import ComunicacionesEventosIndex from '../../../pages/ComunicacionesEventos/ComunicacionesEventosIndex';
import ComunicacionesEvtDataForm from '../../../pages/ComunicacionesEventos/components/ComunicacionDataForm';
import ComunicacionesIndex from '../../../pages/Comunicaciones/ComunicacionesIndex';
import ContenidoDisposiciones from '../../../pages/Contenido/components/ContenidoDisposiciones';
import ContenidoGraficos from '../../../pages/Contenido/components/ContenidoGraficos';
import ContenidoIndex from '../../../pages/Contenido/ContenidoIndex';
import ContenidoNoticias from '../../../pages/Contenido/components/ContenidoNoticias';
import ContenidoNovedades from '../../../pages/Contenido/components/ContenidoNovedades';
import ContenidoVideos from '../../../pages/Contenido/components/ContenidoVideos';
import CreateRole from '../../../pages/AdminRoles/RolesSave/CreateRole';
import DetailContainer from '../../../pages/Patentes/Pasavantes/components/DetailContainer';
import EmpresaSave from '../../../pages/Empresas/EmpresasSave';
import EmpresasIndex from '../../../pages/Empresas/EmpresasIndex';
import FerroviariosSave from '../../../pages/FormacionesFerroviarias/FerroviariosSave';
import FormacionesFerroviariasIndex from '../../../pages/FormacionesFerroviarias/FormFerroviariasIndex';
import GestionSolicitudesIndex from '../../../pages/ServiciosALaNave/GestionSolicitudes/GestionSolicitudesIndex';
import GiroDetailContainer from '../../GiroDetailContainer/GiroDetailContainer';
import GirosIndex from '../../../pages/Giros/GirosIndex';
import GirosSave from '../../../pages/Giros/GirosSave';
import HomePrivado from '../../../pages/HomePrivado/HomePrivado';
import InspeccionVagones from '../../../pages/CartasDePorte/InspeccionVagones';
import LiquidacionContainer from '../../../pages/ServiciosALaNave/GestionSolicitudes/LiquidacionContainer';
import NaviIndex from '../../../pages/Giros/Navi';
import NewsIndex from '../../../pages/HomePrivado/components/News';
import NotificationsIndex from '../../../pages/HomePrivado/components/Notifications';
import PasavanteDetailContainer from '../../../pages/Giros/Pasavantes/components/DetailContainer';
import PasavantesIndex from '../../../pages/Giros/Pasavantes/PasavantesIndex';
import PatentDetailContainer from '../../PatentDetailContainer/PatentDetailContainer';
import PatentIndex from '../../../pages/Patentes/PatentIndex';
import PatentMovements from '../../PatentDetailContainer/components/PatentMovements/PatentMovements';
import PatentSave from '../../../pages/Patentes/PatentSave';
import PatentsNaviIndex from '../../../pages/Patentes/Navi/PatentsNaviIndex';
import PatentsPasavanteIndex from '../../../pages/Patentes/Pasavantes/PatentsPasavanteIndex';
import ServiciosRequest from '../../../pages/ServiciosALaNave/GestionSolicitudes/SolicitudesSave';
import ServiciosSave from '../../../pages/ServiciosALaNave/Administracion/ServiciosSave';
import ShipHistory from '../../../pages/Buques/components/ShipHistory/ShipHistory';
import UpdateRole from '../../../pages/AdminRoles/components/RoleDataForm';
import UserShow from '../../../pages/Usuarios/UserShow';
import UsersIndex from '../../../pages/Usuarios/UsersIndex';
import UsersSave from '../../../pages/Usuarios/UsersSave';
import useUserAccess from '../../../hooks/useUserAccess';

function AdminLayout() {
    const access = useUserAccess();

    return (
        <Routes>
            <Route path="home" element={<HomePrivado />} />
            <Route path="notificaciones" element={<NotificationsIndex />} />
            <Route path="novedades" element={<NewsIndex />} />

            {!!access?.[1]?.[1] && <Route path="buques" element={<BuquesIndex />} />}
            {!!access?.[1]?.[2] && <Route path="buques/alta-de-buque" element={<BuquesSave />} />}
            {!!access?.[1]?.[4] && (
                <Route path="buques/:id/certificados/asignacion" element={<BuquesCertificates />} />
            )}
            {!!access?.[1]?.[33] && <Route path="buques/:id/historico" element={<ShipHistory />} />}
            {!!access?.[1]?.[39] && (
                <Route path="buques/:id/certificados/historico" element={<CertificatesHistory />} />
            )}
            {!!access?.[2]?.[20] && <Route path="giros" element={<GirosIndex />} />}
            {!!access?.[2]?.[21] && (
                <Route path="giros/solicitud-de-atraque" element={<GirosSave />} />
            )}
            {!!access?.[2]?.[22] && (
                <Route path="giros/:id/detalle" element={<GiroDetailContainer />} />
            )}
            {!!access?.[2]?.[31] && (
                <Route path="giros/:id/detalle/agregar-movimiento" element={<AddMovement />} />
            )}
            {!!access?.[2]?.[32] && (
                <Route
                    path="giros/:id/detalle/renovacion"
                    element={<GiroDetailContainer isRenewal />}
                />
            )}
            {!!access?.[2]?.[24] && <Route path="giros/navi" element={<NaviIndex />} />}
            {!!access?.[2]?.[27] && (
                <Route path="giros/navi/:id/detalle" element={<GiroDetailContainer isNavi />} />
            )}
            {!!access?.[2]?.[28] && <Route path="giros/pasavantes" element={<PasavantesIndex />} />}
            {!!access?.[2]?.[29] && (
                <Route path="giros/pasavantes/:id/detalle" element={<PasavanteDetailContainer />} />
            )}
            {!!access?.[6]?.[6] && <Route path="usuarios" element={<UsersIndex />} />}
            <Route path="usuarios/perfil" element={<UserShow />} />
            {!!access?.[6]?.[14] && <Route path="usuarios/crear-usuario" element={<UsersSave />} />}

            {!!access?.[7]?.[40] && <Route path="empresas" element={<EmpresasIndex />} />}
            {!!access?.[7]?.[41] && (
                <Route path="empresas/crear-empresa" element={<EmpresaSave />} />
            )}

            {!!access?.[8]?.[34] && <Route path="patentes" element={<PatentIndex />} />}
            {!!access?.[8]?.[35] && (
                <Route path="patentes/solicitud-de-patente" element={<PatentSave />} />
            )}
            {!!access?.[8]?.[36] && (
                <Route path="patentes/:id/detalle" element={<PatentDetailContainer />} />
            )}
            {!!access?.[8]?.[45] && <Route path="patentes/navi" element={<PatentsNaviIndex />} />}
            {!!access?.[8]?.[46] && (
                <Route path="patentes/navi/:id/detalle/movimientos" element={<PatentMovements />} />
            )}
            {!!access?.[8]?.[47] && (
                <Route path="patentes/navi/:id/detalle" element={<PatentDetailContainer />} />
            )}
            {!!access?.[8]?.[48] && (
                <Route path="patentes/pasavantes" element={<PatentsPasavanteIndex />} />
            )}
            {!!access?.[8]?.[49] && (
                <Route path="patentes/pasavantes/:id/detalle" element={<DetailContainer />} />
            )}

            {!!access?.[4]?.[65] && <Route path="cartas-de-porte" element={<CartasPorteIndex />} />}
            {!!access?.[4]?.[66] && (
                <Route path="cartas-de-porte/:id/detalle" element={<CartaPorteDetail />} />
            )}
            {!!access?.[4]?.[67] && (
                <Route path="cartas-de-porte/alta-carta-porte" element={<CartaPorteSave />} />
            )}
            {!!access?.[4]?.[68] && (
                <Route path="cartas-de-porte/:id/inspeccion" element={<InspeccionVagones />} />
            )}
            {!!access?.[4]?.[69] && (
                <Route path="cartas-de-porte/:id/edicion" element={<CartaPorteSave />} />
            )}

            {!!access?.[4]?.[60] && (
                <Route path="formaciones-ferroviarias" element={<FormacionesFerroviariasIndex />} />
            )}
            {!!access?.[4]?.[62] && (
                <Route
                    path="formaciones-ferroviarias/nueva-formacion"
                    element={<FerroviariosSave />}
                />
            )}
            {!!access?.[4]?.[61] && (
                <Route
                    path="formaciones-ferroviarias/:id/cartas-porte"
                    element={<CartasPorteFormacion />}
                />
            )}
            {!!access?.[5]?.[80] && (
                <>
                    <Route path="comunicaciones" element={<ComunicacionesIndex />} />
                    <Route path="comunicaciones/:id" element={<ComunicacionesDataForm />} />
                </>
            )}
            {!!access?.[5]?.[81] && (
                <>
                    <Route path="comunicaciones-eventos" element={<ComunicacionesEventosIndex />} />
                    <Route
                        path="comunicaciones-eventos/:id"
                        element={<ComunicacionesEvtDataForm />}
                    />
                </>
            )}
            {!!access?.[5]?.[55] && <Route path="gestor-contenidos" element={<ContenidoIndex />} />}

            {!!access?.[5]?.[55] && (
                <Route path="gestor-contenidos/graficos" element={<ContenidoGraficos />} />
            )}
            {!!access?.[5]?.[55] && (
                <Route path="gestor-contenidos/videos" element={<ContenidoVideos />} />
            )}
            {!!access?.[5]?.[55] && (
                <Route path="gestor-contenidos/noticias" element={<ContenidoNoticias />} />
            )}
            {!!access?.[5]?.[55] && (
                <Route path="gestor-contenidos/novedades" element={<ContenidoNovedades />} />
            )}
            {!!access?.[5]?.[55] && (
                <Route
                    path="gestor-contenidos/disposiciones"
                    element={<ContenidoDisposiciones />}
                />
            )}

            {!!access?.[3] && (
                <Route path="servicios-nave">
                    {!!access?.[3]?.[71] && (
                        <Route
                            index
                            path="gestion-servicios"
                            element={<GestionSolicitudesIndex />}
                        />
                    )}
                    {!!access?.[3]?.[74] && (
                        <Route
                            path="gestion-servicios/alta-de-solicitud"
                            element={<ServiciosRequest />}
                        />
                    )}
                    {!!access?.[3]?.[87] && (
                        <Route
                            path="gestion-servicios/liquidacion/:id/detalle"
                            element={<LiquidacionContainer />}
                        />
                    )}
                    {!!access?.[3]?.[88] && (
                        <Route path="administracion" element={<AdministracionIndex />} />
                    )}
                    {!!access?.[3]?.[89] && (
                        <Route path="administracion/nuevo-servicio" element={<ServiciosSave />} />
                    )}
                    {!!access?.[3]?.[90] && (
                        <Route path="administracion/:id/detalle" element={<ServiciosSave />} />
                    )}

                    <Route path="*" element={<p>Ups! Página no encontrada</p>} />
                    <Route path="" element={<Navigate to="/agp/home" replace />} />
                </Route>
            )}

            <Route path="roles" element={<AdminRoles />} />
            <Route path="roles/crear" element={<CreateRole />} />
            <Route path="roles/:id" element={<UpdateRole />} />

            <Route path="*" element={<p>Ups! Página no encontrada</p>} />
            <Route path="/" element={<Navigate to="/agp/home" replace />} />
        </Routes>
    );
}

export default AdminLayout;
