import { Fragment } from 'react';
import _ from 'lodash';
import {
    Card,
    CardContent,
    Checkbox,
    Divider,
    FormControl,
    Grid,
    IconButton,
    NativeSelect,
    TextField,
    Tooltip
} from '@mui/material';
import { Arrow360 } from '../../Icons';
import { getDateTime } from '../../../utils/common';
import { INTEGERS_UNIT } from '../../../constants/regex';
import AddMovementButton from './AddMovementButton';
import Button from '../../button/Button';
import DateTimePickerComponent from '../../DateTimePickerComponent';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Loading from '../../Loading';
import MovementsDetailsDropDown from './MovementsDetailsDropDrown';
import styles from '../style.module.css';
import TripGeneralInformation from '../TripInformation/TripGeneralInformation';

function MovementsContainer(props: any) {
    const {
        access,
        isModifying,
        isNavi,
        isRenewal,
        loadingGiro,
        handleChange,
        setResponseId,
        terminals,
        answerParametrics,
        loadingAnswers,
        movements,
        movementsHistory,
        validateIsEqual,
        giroData,
        getPorts,
        fetchingGiro,
        handleEditGeneralInfo,
        handleUpdateMovement,
        updatingDockingReview,
        updatingMovement,
        errors,
        dateValidations,
        handleFinishReview,
        calculateValidation,
        handleConfirmEditDocking,
        showEditButton,
        confirmAction,
        canAddRemoveMovements,
        handleCheckMovement,
        movementToRenew,
        confirmSubmitRenewal,
        renewingDocking
    } = props;

    const actionButtons = (id: number) => {
        switch (id) {
            case 2:
                return (
                    <Button key={id} onClick={() => setResponseId(id)}>
                        Aceptar
                    </Button>
                );
            case 3:
            case 9:
                return (
                    <div className={styles['btn-dng']} key={id}>
                        <Button type="outlined" onClick={() => setResponseId(id)}>
                            Denegar
                        </Button>
                    </div>
                );
            case 4:
                return (
                    <Button key={id} onClick={() => setResponseId(id)}>
                        Asignar
                    </Button>
                );
            case 5:
                return (
                    <Button
                        key={id}
                        onClick={() => setResponseId(id)}
                        disabled={!validateIsEqual()}
                    >
                        Aprobar
                    </Button>
                );
            case 6:
                return (
                    <div className={styles['btn-dng']} key={id}>
                        <Button type="outlined" onClick={() => setResponseId(id)}>
                            Cancelar Giro
                        </Button>
                    </div>
                );
            case 7:
                return (
                    <div className={styles['btn-dng']} key={id}>
                        <Button type="outlined" onClick={() => setResponseId(id)}>
                            Rechazar
                        </Button>
                    </div>
                );
            case 8:
                return (
                    <Button key={id} onClick={() => setResponseId(id)} disabled={validateIsEqual()}>
                        A Revision
                    </Button>
                );
            case 15:
                return (
                    isModifying &&
                    giroData?.estado === 'modificando' && (
                        <Button key={id} onClick={() => setResponseId(id)}>
                            Finalizar solicitud de modificación
                        </Button>
                    )
                );
            default:
                return <></>;
        }
    };

    if ((loadingGiro || fetchingGiro) && !movements?.length) {
        return (
            <Grid container spacing={2}>
                <Loading size="small" />
            </Grid>
        );
    }

    return (
        <Grid container spacing={2}>
            {movements && (
                <>
                    <Grid item xs={canAddRemoveMovements ? 6 : 12}>
                        <strong>Movimientos</strong>
                    </Grid>
                    {canAddRemoveMovements && <AddMovementButton />}
                    {(isModifying || isNavi) && (
                        <Grid item xs={12}>
                            <TripGeneralInformation
                                data={giroData}
                                getPorts={getPorts}
                                loadingGiro={loadingGiro}
                                fetchingGiro={fetchingGiro}
                                handleEditGeneralInfo={handleEditGeneralInfo}
                                access={access}
                            />
                        </Grid>
                    )}

                    {_.orderBy(movements, ['fechaETA'], ['asc'])?.map(
                        (item: any, index: number) => (
                            <Fragment key={item.id}>
                                <Grid item xs={12} key={item?.id}>
                                    <Card className="card-ship-operations">
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid
                                                    item
                                                    xs={canAddRemoveMovements || isRenewal ? 6 : 12}
                                                    sx={{
                                                        gap: '5px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        fontSize: '18px'
                                                    }}
                                                >
                                                    <Arrow360 />{' '}
                                                    <strong>Movimiento {index + 1}</strong>
                                                </Grid>
                                                {canAddRemoveMovements && (
                                                    <Grid item xs={6} textAlign="right">
                                                        <Tooltip title="Eliminar movimiento">
                                                            <IconButton
                                                                disabled={movements?.length === 1}
                                                                onClick={() =>
                                                                    confirmAction(
                                                                        'remove',
                                                                        index + 1,
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                )}

                                                {isRenewal && (
                                                    <Grid item xs={6} textAlign="right">
                                                        <Checkbox
                                                            disabled={
                                                                item?.fechaEgreso ||
                                                                (!!movementToRenew &&
                                                                    movementToRenew?.id !==
                                                                        item?.id)
                                                            }
                                                            checked={
                                                                (!_.isEmpty(movementToRenew) &&
                                                                    movementToRenew?.id ===
                                                                        item?.id) ||
                                                                false
                                                            }
                                                            value={movementToRenew || false}
                                                            onChange={(e: any) =>
                                                                handleCheckMovement(e, item)
                                                            }
                                                        />
                                                    </Grid>
                                                )}

                                                <Grid item xs={6}>
                                                    Terminal:
                                                </Grid>
                                                <Grid item xs={6}>
                                                    {item?.terminal?.nombre}
                                                </Grid>
                                                <Grid item xs={6}>
                                                    Fecha Inicio:
                                                </Grid>
                                                <Grid item xs={6}>
                                                    {getDateTime(item?.fechaETA)}
                                                </Grid>
                                                <Grid item xs={6}>
                                                    Fecha Fin:
                                                </Grid>
                                                <Grid item xs={6}>
                                                    {getDateTime(item?.fechaETD)}
                                                </Grid>

                                                {(isNavi || isRenewal) && (
                                                    <>
                                                        <Grid item xs={6}>
                                                            Ingreso Real:
                                                        </Grid>
                                                        <Grid xs={6} item>
                                                            <DateTimePickerComponent
                                                                sx={{ width: '80%' }}
                                                                value={
                                                                    (item?.fechaIngreso &&
                                                                        dayjs(
                                                                            item?.fechaIngreso
                                                                        )) ||
                                                                    null
                                                                }
                                                                disabled={calculateValidation(
                                                                    'ingresoReal'
                                                                )}
                                                                format="DD/MM/YYYY HH:mm"
                                                                onChange={(value: any) => {
                                                                    if (
                                                                        value &&
                                                                        dateValidations(
                                                                            'A',
                                                                            value,
                                                                            item
                                                                        )
                                                                    ) {
                                                                        return;
                                                                    } else {
                                                                        handleChange(
                                                                            {
                                                                                target: {
                                                                                    name: 'fechaIngreso',
                                                                                    value: value
                                                                                }
                                                                            },
                                                                            item
                                                                        );
                                                                    }
                                                                }}
                                                                slotProps={{
                                                                    textField: {
                                                                        size: 'small',
                                                                        variant: 'standard',
                                                                        name: 'fechaIngreso',
                                                                        error:
                                                                            !_.isEmpty(errors) &&
                                                                            !!errors[item?.id]
                                                                                ?.fechaIngreso,
                                                                        helperText:
                                                                            !_.isEmpty(errors) &&
                                                                            errors[item?.id]
                                                                                ?.fechaIngreso
                                                                    }
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            Egreso Real:
                                                        </Grid>
                                                        <Grid xs={6} item>
                                                            <DateTimePickerComponent
                                                                sx={{ width: '80%' }}
                                                                value={
                                                                    (item?.fechaEgreso &&
                                                                        dayjs(item?.fechaEgreso)) ||
                                                                    null
                                                                }
                                                                disabled={calculateValidation(
                                                                    'egresoReal',
                                                                    item
                                                                )}
                                                                format="DD/MM/YYYY HH:mm"
                                                                onChange={(value: any) => {
                                                                    if (
                                                                        value &&
                                                                        dateValidations(
                                                                            'B',
                                                                            value,
                                                                            item
                                                                        )
                                                                    ) {
                                                                        return;
                                                                    } else {
                                                                        handleChange(
                                                                            {
                                                                                target: {
                                                                                    name: 'fechaEgreso',
                                                                                    value: value
                                                                                }
                                                                            },
                                                                            item
                                                                        );
                                                                    }
                                                                }}
                                                                slotProps={{
                                                                    textField: {
                                                                        size: 'small',
                                                                        variant: 'standard',
                                                                        name: 'fechaEgreso',
                                                                        error:
                                                                            !_.isEmpty(errors) &&
                                                                            !!errors[item?.id]
                                                                                ?.fechaEgreso,
                                                                        helperText:
                                                                            !_.isEmpty(errors) &&
                                                                            errors[item?.id]
                                                                                ?.fechaEgreso
                                                                    }
                                                                }}
                                                            />
                                                        </Grid>

                                                        <Grid
                                                            item
                                                            xs={6}
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'flex-end'
                                                            }}
                                                        >
                                                            Sitio Real:
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl
                                                                fullWidth
                                                                variant="standard"
                                                                sx={{ width: '80%' }}
                                                            >
                                                                <NativeSelect
                                                                    variant="outlined"
                                                                    disabled={calculateValidation(
                                                                        'sitioReal'
                                                                    )}
                                                                    name="muelleOperacion"
                                                                    value={
                                                                        item?.muelleOperacion?.id ||
                                                                        ''
                                                                    }
                                                                    IconComponent={(_) =>
                                                                        calculateValidation(
                                                                            'sitioReal'
                                                                        ) ? null : (
                                                                            <EditIcon />
                                                                        )
                                                                    }
                                                                    onChange={(event: any) => {
                                                                        handleChange(
                                                                            {
                                                                                target: {
                                                                                    name: 'muelleOperacion',
                                                                                    value: {
                                                                                        id: Number(
                                                                                            event
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                }
                                                                            },
                                                                            item
                                                                        );
                                                                    }}
                                                                >
                                                                    <option
                                                                        value={''}
                                                                        key={index}
                                                                    ></option>
                                                                    {(
                                                                        terminals?.find(
                                                                            (i: any) =>
                                                                                i.id ===
                                                                                item.terminal.id
                                                                        )?.muelle || []
                                                                    )?.map(
                                                                        (
                                                                            muelle: any,
                                                                            index: number
                                                                        ) => (
                                                                            <option
                                                                                value={muelle.id}
                                                                                key={index + 1}
                                                                            >
                                                                                {muelle?.nombre}
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </NativeSelect>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={6}
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'flex-end'
                                                            }}
                                                        >
                                                            Andana Real:
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                sx={{ width: '80%' }}
                                                                disabled={calculateValidation(
                                                                    'andanaReal'
                                                                )}
                                                                variant="standard"
                                                                autoComplete="off"
                                                                name="andanaOperacion"
                                                                InputProps={{
                                                                    endAdornment:
                                                                        calculateValidation(
                                                                            'andanaReal'
                                                                        ) ? null : (
                                                                            <EditIcon />
                                                                        )
                                                                }}
                                                                value={item?.andanaOperacion || ''}
                                                                onChange={(event: any) => {
                                                                    let value = event.target.value;
                                                                    if (
                                                                        (INTEGERS_UNIT.test(
                                                                            value
                                                                        ) ||
                                                                            value === '') &&
                                                                        Number(value) < 6
                                                                    ) {
                                                                        handleChange(
                                                                            {
                                                                                target: {
                                                                                    name: 'andanaOperacion',
                                                                                    value: Number(
                                                                                        event.target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                            },
                                                                            item
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </Grid>
                                                    </>
                                                )}
                                                <Grid
                                                    item
                                                    xs={6}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'flex-end'
                                                    }}
                                                >
                                                    Sitio:
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormControl
                                                        fullWidth
                                                        variant="standard"
                                                        sx={{ width: '80%' }}
                                                    >
                                                        <NativeSelect
                                                            variant="outlined"
                                                            disabled={calculateValidation(
                                                                'sitio',
                                                                item
                                                            )}
                                                            name="idMuelle"
                                                            value={
                                                                item.terminal.muelleMovimiento.id
                                                            }
                                                            IconComponent={(_) =>
                                                                calculateValidation(
                                                                    'sitio',
                                                                    item
                                                                ) ? null : (
                                                                    <EditIcon />
                                                                )
                                                            }
                                                            onChange={(event: any) =>
                                                                handleChange(event, item)
                                                            }
                                                        >
                                                            {(
                                                                terminals?.find(
                                                                    (i: any) =>
                                                                        i.id === item?.terminal?.id
                                                                )?.muelle || []
                                                            )?.map((muelle: any, index: number) => (
                                                                <option
                                                                    value={muelle.id}
                                                                    key={index + 1}
                                                                >
                                                                    {muelle?.nombre}
                                                                </option>
                                                            ))}
                                                        </NativeSelect>
                                                    </FormControl>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={6}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'flex-end'
                                                    }}
                                                >
                                                    Andana:
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        sx={{ width: '80%' }}
                                                        disabled={calculateValidation(
                                                            'andana',
                                                            item
                                                        )}
                                                        variant="standard"
                                                        autoComplete="off"
                                                        name="andana"
                                                        InputProps={{
                                                            endAdornment: calculateValidation(
                                                                'andana',
                                                                item
                                                            ) ? null : (
                                                                <EditIcon />
                                                            )
                                                        }}
                                                        value={item?.andana || ''}
                                                        onChange={(event: any) => {
                                                            let value = event.target.value;
                                                            if (
                                                                (INTEGERS_UNIT.test(value) ||
                                                                    value === '') &&
                                                                Number(value) < 6
                                                            ) {
                                                                handleChange(event, item);
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                {isNavi &&
                                                    (!giroData?.fechaSalidaVanguardia ||
                                                        giroData?.estado === 'revision') && (
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            className={
                                                                styles['grid-button-container']
                                                            }
                                                        >
                                                            <Button
                                                                onClick={() =>
                                                                    handleUpdateMovement(item)
                                                                }
                                                                loading={updatingMovement}
                                                                disabled={
                                                                    !_.isEmpty(errors) &&
                                                                    !_.isEmpty(errors[item?.id])
                                                                }
                                                            >
                                                                Guardar cambios
                                                            </Button>
                                                        </Grid>
                                                    )}
                                                <Grid item xs={12}>
                                                    <Divider component="div" />
                                                </Grid>
                                                {!isNavi && (
                                                    <Grid item xs={12}>
                                                        <MovementsDetailsDropDown
                                                            data={movementsHistory}
                                                            item={item}
                                                            text="Detalle de cambios"
                                                            icon={<ErrorOutlineIcon />}
                                                        />
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Fragment>
                        )
                    )}
                </>
            )}

            {isNavi && giroData?.estado === 'revision' && (
                <Grid item xs={12} className="flex-center" mt={4}>
                    <Button onClick={handleFinishReview} loading={updatingDockingReview}>
                        Finalizar revisión
                    </Button>
                </Grid>
            )}

            {showEditButton && !isModifying && !isRenewal && !isNavi && !loadingGiro && (
                <Grid item xs={12} className="flex-center" mt={4}>
                    <Button
                        onClick={handleConfirmEditDocking}
                        loading={updatingDockingReview}
                        style={{ textTransform: 'uppercase', fontWeight: 700 }}
                    >
                        Modificar solicitud
                    </Button>
                </Grid>
            )}
            {isRenewal && (
                <Grid item xs={12} className="flex-center" mt={4}>
                    <Button
                        disabled={!movementToRenew}
                        onClick={confirmSubmitRenewal}
                        loading={renewingDocking}
                        style={{ textTransform: 'uppercase', fontWeight: 700 }}
                    >
                        Renovar solicitud
                    </Button>
                </Grid>
            )}

            {!isNavi && (
                <Grid item xs={12} className={styles['grid-button-container']}>
                    {loadingAnswers ? (
                        <Loading size="small" />
                    ) : (
                        _.orderBy(answerParametrics, ['id'], ['asc'])?.map((item: any) =>
                            actionButtons(item.id)
                        )
                    )}
                </Grid>
            )}
        </Grid>
    );
}

export default MovementsContainer;
