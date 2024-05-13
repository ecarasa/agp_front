import _ from 'lodash';
import { CERTIFICATE_STATES } from '../../../../commons/States';
import { IconButton, Skeleton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { stateIcons } from '../../BuquesIndex';
import { useTranslation } from 'react-i18next';
import CheckIconAgp from '../../../../assets/icons/checkIconAgp.png';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import EmptyRoundedIcon from '../../../../assets/icons/emptyRoundedIcon.png';
import styles from '../styles.module.css';

const typesIndex: { [key: number]: string } = {
    1: 'Arqueo',
    2: 'Matrícula',
    3: 'Seguro P&I',
    4: 'Seguro Casco & Máquina',
    5: 'Navegación'
};
const CertificatesTable = ({
    parametrics,
    handleViewDoc,
    isLoading,
    uploadingFile,
    loadedFiles,
    handleDeleteCertificate,
    shipData
}: any) => {
    const { t } = useTranslation('userForm');

    return (
        <>
            <span style={{ marginLeft: '4px', fontSize: '14px' }}>
                {t('buquesCertificates.tableSpanHeader')}:
            </span>
            <table className={styles['table-certificates']}>
                <thead>
                    <tr>
                        <th
                            colSpan={4}
                            align="center"
                            className={styles['tablecertificate-thead-th']}
                        >
                            {isLoading ? (
                                <Skeleton variant="rectangular" width="auto" height={45} />
                            ) : (
                                <div className={styles['certificate-table-header']}>
                                    {!isLoading && _.isEmpty(parametrics) && (
                                        <span>Sin información</span>
                                    )}
                                    {parametrics &&
                                        parametrics?.tiposCertificado
                                            ?.filter((i: any) => i.obligatorio)
                                            ?.map((cert: any) => (
                                                <span key={cert?.id}>
                                                    {loadedFiles
                                                        ?.map((i: any) => i?.tipoCertificado?.id)
                                                        ?.includes(cert?.id) ? (
                                                        <img
                                                            src={CheckIconAgp}
                                                            alt="check"
                                                            height={18}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={EmptyRoundedIcon}
                                                            alt="emtpy"
                                                            height={18}
                                                        />
                                                    )}
                                                    {typesIndex[cert?.id]}
                                                </span>
                                            ))}
                                </div>
                            )}
                        </th>
                    </tr>
                </thead>
                <tbody style={{ background: 'rgb(234, 229, 229)' }}>
                    {(isLoading
                        ? Array.from(new Array(3))
                        : _.orderBy(loadedFiles, ['tipoCertificado.id'], ['asc'])
                    )?.map((item: any) =>
                        !item ? (
                            <tr key={Math.random()}>
                                <td>
                                    <Skeleton height={56} width={'auto'} variant="rectangular" />
                                </td>
                            </tr>
                        ) : (
                            <tr key={item?.id}>
                                <td width="55%">
                                    <table>
                                        <tbody className={styles['table-tbody']}>
                                            <tr>
                                                <td>{t('buquesCertificates.certificate')}:</td>
                                                <td>{item?.tipoCertificado?.nombre}</td>
                                            </tr>
                                            <tr>
                                                <td>{item?.puntaje ? t('score') : t('number')}:</td>
                                                <td>{item?.puntaje || item?.numero}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td width="10%">
                                    <table>
                                        <tbody className={styles['table-tbody']}>
                                            <tr>
                                                <td>Estado:</td>
                                                <td style={{ display: 'inline-flex' }}>
                                                    {stateIcons(item.estado)}
                                                    {CERTIFICATE_STATES[item?.estado]}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td width="20%" align="right">
                                    <table>
                                        <tbody className={styles['table-tbody']}>
                                            <tr>
                                                <td>Emision:</td>
                                                <td>
                                                    {item?.fechaEmision
                                                        ? dayjs(item?.fechaEmision).format(
                                                              'DD/MM/YYYY'
                                                          )
                                                        : 'N/A'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Certificado:</td>
                                                <td>
                                                    {item?.ddjj ? (
                                                        <span>Sin adjunto</span>
                                                    ) : (
                                                        <Tooltip
                                                            title="Ver/Descargar archivo adjunto"
                                                            placement="top"
                                                        >
                                                            <Link
                                                                to="#"
                                                                onClick={() => handleViewDoc(item)}
                                                            >
                                                                <span>Descargar</span>
                                                            </Link>
                                                        </Tooltip>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>

                                {shipData?.estado === 'BO' && (
                                    <td width="5%" align="right" style={{ textAlign: 'center' }}>
                                        <Tooltip title={t('delete')}>
                                            <IconButton
                                                aria-label="menuOpciones"
                                                onClick={() => handleDeleteCertificate(item)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </td>
                                )}
                            </tr>
                        )
                    )}
                </tbody>
                {uploadingFile && (
                    <tfoot>
                        <tr>
                            <td colSpan={3}>
                                <Skeleton height={56} width="100%" variant="rectangular" />
                            </td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </>
    );
};

export default CertificatesTable;
