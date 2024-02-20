import { GetServerSideProps } from "next";
import { jwt } from "../../../utils";
import { DataGridPro, GRID_CHECKBOX_SELECTION_COL_DEF, GridActionsCell, GridActionsCellItem, gridPageCountSelector, gridVisibleSortedRowIdsSelector, useGridApiContext, useGridSelector, GridCsvGetRowsToExportParams, GridCsvExportOptions } from '@mui/x-data-grid-pro';
import { AppBar, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, ListItemButton, ListItemIcon, Pagination, TableCell, TableRow, Toolbar, Tooltip, Typography, Zoom, styled, tableCellClasses, Menu } from '@mui/material';
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
import Image from "next/image";
import { PictureAsPdf } from "@mui/icons-material";
import { PDFLayout } from "../../../components/layouts/PDFLayout";
import { NoRowsLayout } from "../../../components/layouts/NoRowsLayout";
import { useCompanies } from "../../../hooks/useCompanies";

export default function CompaniesList(props: any) {

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

    const { Companies } = props;

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

    const { companies, isLoadingCompanies } = useCompanies(`/companies`)

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

    const rows = (companies || []).map(dataRow => {

        return {
            id: dataRow.Id,
            name: dataRow.Company,
            rfc: dataRow.RFC,
            subsidiary: dataRow.Subsidiary,
            turn: dataRow.Turn,
            legalproxy: dataRow.LegalProxy,
            state: dataRow.State,
            town: dataRow.Town,
            address: dataRow.Address,
            type: dataRow.Type,
            charter: dataRow.Charter,
            zone: dataRow.Zone,
            vat: dataRow.VAT + '%',
            createdAt: formatmmddyy(dataRow.CreatedAt),
            companytype: dataRow.CompanyType
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
                        fontWeight={500} letterSpacing={'.2px'}>{Companies.CompanyList}
                    </Typography>
                    <Divider sx={{ width: 500 }} />
                </div>
                <Row>
                    <Tooltip title={<Typography id='TypographyNeutro' letterSpacing={'.5px'} fontSize={'11px'}>Borrado masivo de 1 o mas empresas seleccionadas</Typography>} arrow placement="right">
                        <span>
                            <Button id='Button2' variant="contained" disabled={bulkList.length == 0} onClick={() => handleOpenDialog(2)}>{Companies.BulkDelete}</Button>
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
                    <Button disabled={isLoadingToEdit} id='Button2' variant="contained" onClick={() => handleRouter('/companies/register', 1)}>
                        {isLoadingToRegiser ? <CircularProgress color='inherit' size={25} thickness={4} /> : Companies.Register}</Button>
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
            await axios.put(`/api/companies`, { id, ErasedAt }).then(async (result) => {

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
                enqueueSnackbar('La Empresa ha sido borrado correctamente', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left'
                    }
                })
                handleClose()
                await mutate(`/api/companies`, companies, true);
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
            await axios.put(`/api/companies`, { bulkList, isBulk }).then(async (result) => {
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
                enqueueSnackbar(bulkList.length == 1 ? 'La Empresa ha sido borrado correctamente' : 'Las Empresas han sido borrados correctamente', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left'
                    }
                })
                handleClose()
                setBulkList([])
                await mutate(`/api/companies`, companies, true);
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

    const titlesArray = [Companies.CompanyType, Companies.Name, Companies.RFC, Companies.Subsidiary, Companies.Turn,
    Companies.LegalProxy, Companies.State, Companies.Town, Companies.Address, Companies.Type,
    Companies.Charter, Companies.Zone, Companies.VAT, Companies.CreationDate]

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
                            <StyledTableCell component="th" scope="row">{item.name}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{item.rfc}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{item.subsidiary}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{item.turn}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{item.legalproxy}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{item.state}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{item.town}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{item.address}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{item.type}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{item.charter}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{item.zone}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{item.vat}</StyledTableCell>
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
                        <StyledTableCell component="th" scope="row">{item.name}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.rfc}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.subsidiary}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.turn}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.legalproxy}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.state}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.town}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.address}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.type}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.charter}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.zone}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.vat}</StyledTableCell>
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
                    <PDFLayout titles={titles} values={values} title={'Reporte de Empresas'} />
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
                                            {dialogType == 1 ? 'Borrar Empresa' : 'Borrado Masivo'}
                                        </DialogTitle>
                                    </Toolbar>
                                </AppBar>
                                <DialogContent sx={{ height: 150, width: 500, display: 'grid', placeItems: 'center' }}>
                                    {
                                        isLoadingDialog ? <CircularProgress size={50} color='inherit' /> :
                                            <>
                                                <Typography id='TypographyNeutro' fontWeight={500} textAlign={'left'}>
                                                    {dialogType == 1 ? '¿Esta seguro que desea borrar este empresa?' :
                                                        (bulkList.length == 1 ? '¿Esta seguro que desea eliminar esta empresa?' :
                                                            '¿Esta seguro que desea eliminar estas empresas?')}
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
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                initialState={{ pinnedColumns: { left: [GRID_CHECKBOX_SELECTION_COL_DEF.field], right: ['actions'] } }}
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
                                loading={isLoadingCompanies}
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
                                    headerName: Companies.CompanyType,
                                    width: 300,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.CompanyType}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'name',
                                    headerName: Companies.Name,
                                    width: 300,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.Name}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'rfc',
                                    headerName: Companies.RFC,
                                    width: 210,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.RFC}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'subsidiary',
                                    headerName: Companies.Subsidiary,
                                    width: 300,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.Subsidiary}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'turn',
                                    headerName: Companies.Turn,
                                    width: 200,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.Turn}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'legalproxy',
                                    headerName: Companies.LegalProxy,
                                    width: 300,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.LegalProxy}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'state',
                                    headerName: Companies.State,
                                    width: 200,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.State}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'town',
                                    headerName: Companies.Town,
                                    width: 200,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.Town}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'address',
                                    headerName: Companies.Address,
                                    width: 400,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.Address}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'type',
                                    headerName: Companies.Type,
                                    width: 150,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.Type}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'charter',
                                    headerName: Companies.Charter,
                                    width: 200,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.Charter}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'zone',
                                    headerName: Companies.Zone,
                                    width: 200,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.Zone}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'vat',
                                    headerName: Companies.VAT,
                                    width: 100,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.VAT}
                                        </div>
                                    ),
                                },

                                {
                                    field: 'createdAt',
                                    headerName: Companies.CreationDate,
                                    width: 200,
                                    editable: false,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.CreationDate}
                                        </div>
                                    ),
                                },
                                {
                                    field: 'actions',
                                    type: 'actions',
                                    width: 120,
                                    headerName: Companies.actions,
                                    renderHeader: () => (
                                        <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                                            {Companies.actions}
                                        </div>
                                    ),
                                    getActions: ({ id }) => [
                                        <>
                                            {
                                                <>
                                                    <GridActionsCellItem disabled={isLoadingToRegiser || isLoadingDialog} icon={<Tooltip arrow placement='left' title={<Typography id='TypographyNeutro' fontSize={'12px'}>{Companies.Edit}</Typography>}>{id == idEdit && isLoadingToEdit ? <CircularProgress color="inherit" thickness={5} size={20} /> : <EditIcon />}</Tooltip>} key={Number(id) + Math.random()} onClick={() => { setIdEdit(Number(id)), handleRouter(`/companies/edit/${id}`, 2) }} sx={{ ':hover': { color: 'green' }, color: "#393939", p: 1 }} label="Edit" />
                                                </>
                                            }
                                            {
                                                <>
                                                    <GridActionsCellItem disabled={isLoadingToRegiser || isLoadingDialog} icon={<Tooltip arrow placement='right' title={<Typography id='TypographyNeutro' fontSize={'12px'}>{Companies.Delete}</Typography>}><DeleteIcon /></Tooltip>} key={Number(id) + Math.random()} onClick={() => { handleOpenDialog(1), setIdDelete(Number(id)) }} sx={{ ':hover': { color: 'red' }, color: "#393939", p: 1 }} label="Delete" />
                                                </>
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
        props: { Companies: response.default.Companies }
    }
}