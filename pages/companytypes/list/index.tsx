import { GetServerSideProps } from "next";
import { jwt } from "../../../utils";
import { DataGridPro, GridActionsCell, GridActionsCellItem, gridPageCountSelector, useGridApiContext, useGridSelector, GridCsvGetRowsToExportParams, gridVisibleSortedRowIdsSelector, GridCsvExportOptions, GridRowParams } from '@mui/x-data-grid-pro';
import { AppBar, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, ListItemButton, ListItemIcon, Menu, Pagination, TableCell, TableRow, Toolbar, Tooltip, Typography, Zoom, styled, tableCellClasses } from "@mui/material";
import { Layout } from "../../../components/layouts";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { Row, Spacer } from "@nextui-org/react";
import { useRouter } from "next/router";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { useSnackbar } from "notistack";
import { mutate } from "swr";
import { useCompanyTypes } from "../../../hooks/useCompanyTypes";
import { PictureAsPdf } from "@mui/icons-material";
import Image from "next/image";
import { PDFLayout } from "../../../components/layouts/PDFLayout";
import { NoRowsLayout } from "../../../components/layouts/NoRowsLayout";

export default function CompanyTypesList(props: any) {

    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar();

    const [isLoadingToRegiser, setIsLoadingToRegister] = useState(false)
    const [isLoadingToEdit, setIsLoadingToEdit] = useState(false)

    const [isLoadingDialog, setIsLoadingDialog] = useState(false)
    const [bulkList, setBulkList] = useState<any[]>([]);


    const handleRouter = (href: string, type: number) => {
        //type 1 = register
        //type 2 = edit
        if (type == 1) {
            setIsLoadingToRegister(true)
        }
        if (type == 2) {
            setIsLoadingToEdit(true)
        }

        router.push(href).catch(() => { setIsLoadingToRegister(false), setIsLoadingToEdit(false) }).then(() => {
            setIsLoadingToRegister(false)
            setIsLoadingToEdit(false)
        })

    }

    const { CompanyTypes } = props;

    function getWindowDimensions() {
        if (typeof window !== "undefined") {
            const { innerWidth: width, innerHeight: height } = window;
            return {
                width,
                height
            };
        }
        return { width: 0, height: 0 }

    }

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    const { companyTypes, isLoadingCompanyTypes } = useCompanyTypes(`/companytypes`)

    function formatmmddyy(date: any) {
        if (!date) {
            return ''
        }
        date = new Date(date);

        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();

        return (day + '/' + month + '/' + year);
    }

    const rows = (companyTypes || []).map(dataRow => {

        return {
            id: dataRow.Id,
            companytype: dataRow.CompanyType,
            isstatic: dataRow.IsStatic,
            createdAt: formatmmddyy(dataRow.CreatedAt)

        }
    });

    const [width193, setWidth] = useState(0)
    const [clientXY, setClientXY] = useState([0, 0]);
    const [openRefArchive, setOpenRefArchive] = useState(false);

    const handleToggleArchives = () => {
        const x = document.getElementById('ButtonMenuArchive')?.getBoundingClientRect().x
        const y = document.getElementById('ButtonMenuArchive')?.getBoundingClientRect().y
        const width = document.getElementById('ButtonMenuArchive')?.getBoundingClientRect().width;
        setWidth((width == undefined ? 0 : (width)))
        setClientXY([(y == undefined ? 0 : y - 8), (x == undefined ? 0 : x + 139)])
        setOpenRefArchive(true);
    };

    function CustomToolbar() {

        const apiRef = useGridApiContext();

        const getFilteredRows = ({ apiRef }: GridCsvGetRowsToExportParams) =>
            gridVisibleSortedRowIdsSelector(apiRef);
        const handleClick = (options: GridCsvExportOptions) => {
            options.utf8WithBom = true;
            options.includeHeaders = true;
            apiRef.current.exportDataAsCsv(options);

        }

        return (
            <>
                <div style={{ paddingBottom: 10 }}>
                    <Typography variant={windowDimensions.width < 1900 ? 'h5' : 'h4'} id='TypographyNeutro' paddingBottom={1}
                        fontWeight={500} letterSpacing={'.2px'}>{CompanyTypes.CompanyTypeList}
                    </Typography>
                    <Divider sx={{ width: 500 }} />
                </div>
                <Row>
                    <Tooltip title={<Typography id='TypographyNeutro' letterSpacing={'.5px'} fontSize={'11px'}>Borrado masivo de 1 o mas tipos de empresa seleccionados</Typography>} arrow placement="right">
                        <span>
                            <Button id='Button2' variant="contained" disabled={bulkList.length == 0} onClick={() => handleOpenDialog(2)}>{CompanyTypes.BulkDelete}</Button>
                        </span>
                    </Tooltip>
                    <Spacer style={{ flex: 1 }} />
                    <Button name='buttonExport' id='ButtonMenuArchive' variant="contained"
                        sx={{ marginRight: 2 }}
                        onFocus={() => handleToggleArchives()}>
                        {`Exportar A`}
                    </Button>
                    <Menu
                        TransitionProps={{ timeout: 0 }}
                        anchorEl={null}
                        id="account-menu"
                        open={openRefArchive}
                        onClose={() => setOpenRefArchive(false)}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                width: width193 - 6,
                                borderRadius: '12px',
                                boxShadow: 'rgba(230, 242, 242) 0px 3px 12px 1px',
                                transition: 'none !important',
                                overflow: 'visible',
                            },
                        }}
                        anchorReference="anchorPosition"
                        anchorPosition={{ top: clientXY[0] + 60, left: clientXY[1] + 58 }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <Grid container spacing={1} padding={1} height={'100%'}>
                            <Grid item xs={12}>
                                <ListItemButton sx={{ width: '100%', borderRadius: '10px' }} onClick={() => { handleClickPDF(), setOpenRefArchive(false) }}>
                                    <ListItemIcon>
                                        <PictureAsPdf htmlColor='#2B2B2B' />
                                    </ListItemIcon>
                                    <Typography sx={{ fontFamily: 'Nunito Sans', fontSize: '14px' }}>{'PDF'}</Typography>
                                </ListItemButton>
                            </Grid>
                            <Grid item xs={12}>
                                <ListItemButton sx={{ width: '100%', borderRadius: '10px' }} onClick={() => { handleClick({ getRowsToExport: getFilteredRows }), setOpenRefArchive(false) }}>
                                    <ListItemIcon>
                                        <Image width={26} height={26} style={{ color: '#2B2B2B' }} src="/img/icons8-xls-48.png" />
                                    </ListItemIcon>
                                    <Typography sx={{ fontFamily: 'Nunito Sans', fontSize: '14px' }}>{'CSV'}</Typography>
                                </ListItemButton>
                            </Grid>
                        </Grid>
                    </Menu>
                    <Button disabled={isLoadingToEdit} id='Button2' variant="contained" onClick={() => handleRouter('/companytypes/register', 1)}>
                        {isLoadingToRegiser ? <CircularProgress color='inherit' size={25} thickness={4} /> : CompanyTypes.Register}</Button>
                </Row>
                <Divider sx={{ paddingBottom: 1 }} />
                <Spacer />
            </>
        )


    }
    function CustomPagination() {
        const apiRef = useGridApiContext();
        const pageCount = useGridSelector(apiRef, gridPageCountSelector);

        return (
            <Box my={2} display="flex" justifyContent="flex-start" height={10} alignContent="center" alignItems='center' padding={1}>
                <Pagination
                    style={{ flexDirection: "row" }}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    count={pageCount}
                    //renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
                    onChange={(event: React.ChangeEvent<unknown>, value: number) =>
                        apiRef.current.setPage(value - 1)
                    }
                />
            </Box>

        );
    }


    const [dialogType, setDialogType] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [idDelete, setIdDelete] = useState(0);
    const [idEdit, setIdEdit] = useState(0);

    const handleOpenDialog = (type: number) => {
        setDialogType(type);
        setOpenDialog(true)
    }

    const handleClose = () => {
        setOpenDialog(false)
        setDialogType(0)
    }

    const formatDate = () => {

        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDateString

    }

    const handleDelete = async () => {

        try {

            if (idDelete == 0) {
                return
            }

            const id = idDelete;
            const ErasedAt = formatDate();
            setIsLoadingDialog(true)
            await axios.put(`/api/companytypes`, { id, ErasedAt }).then(async (result) => {

                if (result.status != 200) {
                    setIsLoadingDialog(false)
                    enqueueSnackbar('Ocurrió un error en el borrado, favor de revisar.', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                        }
                    })
                    return
                }

                setIsLoadingDialog(false)
                enqueueSnackbar('El tipo de empresa ha sido borrado correctamente', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left'
                    }
                })
                handleClose()
                await mutate(`/api/companytypes`, companyTypes, true);
            })

        }
        catch (err: any) {
            console.log(err)
        }
    }

    const handleBulkDelete = async () => {
        try {
            if (bulkList.length == 0) {
                return
            }

            const isBulk = true
            setIsLoadingDialog(true)
            await axios.put(`/api/companytypes`, { bulkList, isBulk }).then(async (result) => {
                if (result.status != 200) {
                    setIsLoadingDialog(false)
                    enqueueSnackbar('Ocurrió un error en el borrado masivo, favor de revisar', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                        }
                    })
                    return
                }
                setIsLoadingDialog(false)
                enqueueSnackbar(bulkList.length == 1 ? 'El tipo de empresa ha sido borrado correctamente' : 'Los tipos de orden han sido borrados correctamente', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left'
                    }
                })
                handleClose()
                setBulkList([])
                await mutate(`/api/companytypes`, companyTypes, true);
            })
        }
        catch (err: any) {
            setIsLoadingDialog(false)
            console.log(err)
        }
    }

    const [openPDF, setPDF] = useState(false)
    const [refreshIn, setRefreshIn2] = useState(false);

    const setRefreshIn = () => {
        setRefreshIn2(true)
        setTimeout(() => {
            setRefreshIn2(false);
        }, 100);
    };

    const handleClickPDF = async () => {

        await setPDF(true);
        await setPDF(false);
        await setRefreshIn();

    }

    const titlesArray = [CompanyTypes.CompanyType, CompanyTypes.CreationDate]

    let values: any = []

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#0C0C0C ',
            color: theme.palette.common.white,
            fontSize: router.locale != 'en' ? 14 : 16,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: router.locale != 'en' ? 14 : 16,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,

        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    let titles: any = [];

    let indexSplit = 18;

    titles = [titles, ...titlesArray.map((item: any) => {
        return (
            <StyledTableCell key={item}>{item}</StyledTableCell>
        )
    })];

    values = [values, ...rows.map(

        (item: any, index: any) => {

            if (index == indexSplit) {
                indexSplit = (indexSplit + 19)
                return (
                    <>
                        <div className="html2pdf__page-break"></div>
                        <p></p>
                        <StyledTableRow style={{ backgroundColor: '#0C0C0C' }}>
                            {
                                titlesArray.map(
                                    (f: any) => {
                                        return (
                                            <>
                                                <StyledTableCell style={{ color: '#FFFFFF' }} component="th" scope="row">{f.toString()}</StyledTableCell>
                                            </>
                                        )
                                    }
                                )
                            }
                        </StyledTableRow>
                        <StyledTableRow
                            key={index + Math.random()}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <StyledTableCell component="th" scope="row">{item.companytype}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{item.createdAt}</StyledTableCell>
                        </StyledTableRow >
                    </>
                )
            }
            else {
                return (
                    <StyledTableRow
                        key={index + Math.random()}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <StyledTableCell component="th" scope="row">{item.companytype}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.createdAt}</StyledTableCell>
                    </StyledTableRow >
                )
            }
        }
    )];

    const noRows = () => {
        return (
            <NoRowsLayout />
        )
    }

    return (
        <>
            {
                openPDF
                    ?
                    <PDFLayout titles={titles} values={values} title={'Reporte de Tipos de Empresa'} />
                    :
                    <>
                        <Layout>
                            <Dialog
                                className="fadeIn"
                                fullScreen={false}
                                open={openDialog}
                                maxWidth={'lg'}
                                onClose={handleClose}
                                TransitionComponent={Zoom}
                                aria-labelledby="responsive-dialog-title">
                                <AppBar sx={{ position: 'relative', backgroundColor: '#1c1c1c' }}>
                                    <Toolbar style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                        <DialogTitle id="responsive-dialog-title" sx={{ letterSpacing: '1px', fontFamily: 'M PLUS 2', fontWeight: 400 }}>
                                            {dialogType == 1 ? 'Borrar tipo de empresa' : 'Borrado Masivo'}
                                        </DialogTitle>
                                    </Toolbar>
                                </AppBar>
                                <DialogContent sx={{ height: 150, width: 500, display: 'grid', placeItems: 'center' }}>
                                    {
                                        isLoadingDialog ? <CircularProgress size={50} color='inherit' /> :
                                            <>
                                                <Typography id='TypographyNeutro' fontWeight={500} textAlign={'left'}>
                                                    {dialogType == 1 ? '¿Esta seguro que desea borrar este tipo de empresa?' :
                                                        (bulkList.length == 1 ? '¿Esta seguro que desea eliminar este tipo de empresa?' :
                                                            '¿Esta seguro que desea eliminar estos tipos de empresa?')}
                                                </Typography>
                                                <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Button variant="contained" id='Button2' sx={{ marginRight: 3 }} onClick={handleClose}>
                                                        {'No'}
                                                    </Button>
                                                    <Button variant="contained" id='Button2' onClick={dialogType == 1 ? handleDelete : handleBulkDelete}>
                                                        {'Si'}
                                                    </Button>
                                                </DialogActions>
                                            </>
                                    }
                                </DialogContent>

                            </Dialog>

                            <DataGridPro
                                isRowSelectable={(params: GridRowParams) => params.row.isstatic != 1}
                                checkboxSelection
                                onSelectionModelChange={(row) => {
                                    setBulkList(row)
                                }}
                                selectionModel={bulkList}
                                pagination
                                components={{
                                    Pagination: CustomPagination,
                                    Toolbar: CustomToolbar,
                                    NoRowsOverlay: noRows
                                }}
                                sx={{ fontWeight: 500, fontSize: '14px', flex: 1, mx: 'auto', p: 1, width: `${windowDimensions.width < 1300 ? '100%' : windowDimensions.width - 380}px`, minHeight: '70vh', border: 'none', fontFamily: 'Archivo' }}
                                loading={isLoadingCompanyTypes}
                                rows={rows}
                                columns={[{
                                    field: 'id',
                                    headerName: 'id',
                                    width: 150,
                                    editable: false,
                                    hide: true

                                },
                                {
                                    field: 'companytype',
                                    headerName: CompanyTypes.CompanyType,
                                    minWidth: 400,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {CompanyTypes.CompanyType}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'createdAt',
                                    headerName: CompanyTypes.CreationDate,
                                    width: 300,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {CompanyTypes.CreationDate}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'actions',
                                    type: 'actions',
                                    width: 120,
                                    headerName: CompanyTypes.actions,
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {CompanyTypes.actions}
                                        </div>
                                    ),
                                    getActions: ({ id }) => [
                                        <>
                                            {
                                                rows.filter(f => f.id == id).map(f => f.isstatic)[0] == 0 && (
                                                    <>
                                                        <GridActionsCellItem disabled={isLoadingToRegiser || isLoadingDialog} icon={<Tooltip arrow placement='left' title={<Typography id='TypographyNeutro' fontSize={'12px'}>{CompanyTypes.Edit}</Typography>}>{id == idEdit && isLoadingToEdit ? <CircularProgress color="inherit" thickness={5} size={20} /> : <EditIcon />}</Tooltip>} key={Number(id) + Math.random()} onClick={() => { setIdEdit(Number(id)), handleRouter(`/companytypes/edit/${id}`, 2) }} sx={{ ':hover': { color: 'green' }, color: "#393939", p: 1 }} label="Edit" />
                                                        <GridActionsCellItem disabled={isLoadingToRegiser || isLoadingDialog} icon={<Tooltip arrow placement='right' title={<Typography id='TypographyNeutro' fontSize={'12px'}>{CompanyTypes.Delete}</Typography>}><DeleteIcon /></Tooltip>} key={Number(id) + Math.random()} onClick={() => { handleOpenDialog(1), setIdDelete(Number(id)) }} sx={{ ':hover': { color: 'red' }, color: "#393939", p: 1 }} label="Delete" />
                                                    </>
                                                )
                                            }


                                        </>
                                    ],
                                },
                                ]}
                            />
                        </Layout>
                    </>
            }
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {

    const { token = '' } = req.cookies;
    const response = await import(`../../../lang/${locale}.json`);
    let isValidToken = false;
    let isAdmin = false;

    try {
        await jwt.isValidToken(token);
        isValidToken = true;
        isAdmin = Boolean(await jwt.isAdmin(token));

    } catch (error) {
        isValidToken = false;
        isAdmin = false;

    }
    if (!isAdmin) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }
    if (!isValidToken) {
        return {
            redirect: {
                destination: '/auth/login?p=/',
                permanent: false,
            }
        }
    }

    return {
        props: { CompanyTypes: response.default.CompanyTypes }
    }
}