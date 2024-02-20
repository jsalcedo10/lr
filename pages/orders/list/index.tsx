import { GetServerSideProps } from "next";
import { jwt } from "../../../utils";
import { DataGridPro, GridActionsCell, GridActionsCellItem, gridPageCountSelector, useGridApiContext, useGridSelector, GridCsvGetRowsToExportParams, gridVisibleSortedRowIdsSelector, GridCsvExportOptions } from '@mui/x-data-grid-pro';
import { AppBar, Button, Card, CircularProgress, Divider, Grid, IconButton, Menu, MenuItem, Pagination, Toolbar, Tooltip, Typography, TextField, createTheme, alpha, Dialog, Zoom, DialogTitle, DialogContent, DialogActions, ListItemButton, ListItemIcon, tableCellClasses, styled, TableRow, TableCell } from '@mui/material';
import { Layout } from "../../../components/layouts";
import { useEffect, useState } from "react";
import { useSales } from "../../../hooks/useSales";
import Box from '@mui/material/Box';
import { Row, Spacer } from "@nextui-org/react";
import { useRouter } from "next/router";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Close, HighlightOff, PictureAsPdf } from "@mui/icons-material";
import { useCompanyTypes } from "../../../hooks/useCompanyTypes";
import { useOrders } from "../../../hooks/useOrders";
import { useOrderTypes } from "../../../hooks/useOrderTypes";
import axios from "axios";
import { mutate } from "swr";
import { useSnackbar } from "notistack";
import Image from "next/image";
import { PDFLayout } from "../../../components/layouts/PDFLayout";

export default function ProductList(props: any) {

  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar();
  const { companyTypes, isLoadingCompanyTypes } = useCompanyTypes(`/companytypes`)
  const { orderTypes, isLoadingOrderTypes } = useOrderTypes(`/ordertypes`)

  const theme = createTheme();

  const style = {
    '& .MuiFilledInput-root': {
      border: '1px solid #e2e2e1',
      fontFamily: 'Archivo', fontWeight: 400, fontSize: '16px',
      overflow: 'hidden',
      borderRadius: '3px',
      height: 50,
      backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&.Mui-focused': {
        backgroundColor: 'transparent',
        boxShadow: `${alpha(theme.palette.info.main, 0.25)} 0 0 0 2px`,
        borderColor: theme.palette.info.main,
      },
    },
  }

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBulk, setIsLoadingBulk] = useState(false)
  const [bulkList, setBulkList] = useState<any[]>([]);
  const [isLoadingToRegiser, setIsLoadingToRegister] = useState(false)
  const [isLoadingDialog, setIsLoadingDialog] = useState(false)
  const [isLoadingToEdit, setIsLoadingToEdit] = useState(false)
  const [idEdit, setIdEdit] = useState(0);
  const [dialogType, setDialogType] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const handleOpenDialog = (type: number) => {
    setDialogType(type);
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setDialogType(0)
  }

  const handleRouter = (href: string) => {
    setIsLoading(true)
    router.push(href).catch(() => { setIsLoading(false) }).then(() => {
      setIsLoading(false)
    })

  }

  const bulkDelete = async () => {

  }

  const { Sales } = props;

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

  const { orders, isLoadingOrders } = useOrders(`/orders`)

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
  const rows = (orders || []).map(dataRow => {
    return {
      id: dataRow.Id,
      date: formatmmddyy(dataRow.Date),
      ordertype: dataRow.OrderType,
      companytype: dataRow.CompanyType,
      company: dataRow.Company,
      subsidiary: dataRow.Subsidiary,
      vatunit: Number(dataRow.VatUnit).toLocaleString('en-US', { maximumFractionDigits: 6 }) + ' ' + dataRow.Currency,
      quantity: Number(dataRow.Quantity).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 }) + ' ' + dataRow.Unit,
      charter: dataRow.Charter,
      charterQuantityPrice: dataRow.CharterQuantityPrice,
      iepstotalunit: Number(dataRow.IepsTotalUnit).toLocaleString('en-US', { maximumFractionDigits: 6 }) + ' ' + dataRow.Currency,
      conceptSale: dataRow.ConceptSale,
      conceptPurchase: dataRow.ConceptPurchase,
      companytype_id: dataRow.CompanyType_Id,
      ordertype_id: dataRow.OrderType_Id,
      currency: dataRow.Currency,
      carrier: dataRow.Carrier,
      product: dataRow.Product,
      unit: dataRow.Unit,
      unitBase: Number(dataRow.UnitBase).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 }) + ' ' + dataRow.Currency,
      vatTotalUnit: Number(dataRow.VatTotalUnit).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 }) + ' ' + dataRow.Currency,
      iepsUnit: Number(dataRow.IepsUnit).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 }) + ' ' + dataRow.Currency,
      totalUnitPrice: Number(dataRow.TotalUnitPrice).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 }) + ' ' + dataRow.Currency,
      totalBase: Number(dataRow.TotalBase).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 }) + ' ' + dataRow.Currency,
      vatTotal: Number(dataRow.VatTotal).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 }) + ' ' + dataRow.Currency,
      iepsTotal: Number(dataRow.IepsTotal).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 }) + ' ' + dataRow.Currency,
      total: Number(dataRow.Total).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 }) + ' ' + dataRow.Currency,
      updatedAt: formatmmddyy(dataRow.UpdatedAt),
    };
  });

  const [clientXY, setClientXY] = useState([0, 0]);
  const [menu, openMenu] = useState(false);

  const [companyType, setCompanyType] = useState(0)
  const [orderType, setOderType] = useState(0)
  const [company, setCompany] = useState('')
  // const [sale, setConceptSale] = useState('')
  const [order, setConceptSale] = useState('')
  const [purchase, setConceptPurchase] = useState('')
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

  const [width193, setWidth] = useState(0)
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

    const handleOpenMenu = () => {
      const x = document.getElementById('Filters')?.getBoundingClientRect().x
      const y = document.getElementById('Filters')?.getBoundingClientRect().y
      setClientXY([(y == undefined ? 0 : y), (x == undefined ? 0 : x)])
      openMenu(true)
    }

    const handleCloseMenu = (event: any) => {
      openMenu(false)
    }

    const [companyType2, setCompanyType2] = useState(companyType)
    const [orderType2, setOderType2] = useState(orderType)
    const [company2, setCompany2] = useState(company)
    const [sale2, setConceptSale2] = useState(order)
    const [purchase2, setConceptPurchase2] = useState(purchase)

    const handleCompanyType = (event: any) => {
      setCompanyType(event.value)
      setCompanyType2(event.value)
    }

    const handleOrderType = (event: any) => {
      setOderType(event.value)
      setOderType2(event.value)
    }

    const handleCompany = (event: any) => {
      setCompany2(event.target.value)
    }

    const handleCompanyPress = (event: any) => {
      if (event.key == 'Enter') {
        setCompany(event.target.value)
        setCompany2(event.target.value)
      }
    }



    const handleSale = (event: any) => {
      setConceptSale2(event.target.value)
    }

    const handleSalePress = (event: any) => {
      if (event.key == 'Enter') {
        setConceptSale(event.target.value)
        setConceptSale2(event.target.value)
      }
    }

    const handlePurchase = (event: any) => {
      setConceptPurchase2(event.target.value)
    }

    const handlePurchasePress = (event: any) => {
      if (event.key == 'Enter') {
        setConceptPurchase(event.target.value)
        setConceptPurchase2(event.target.value)
      }
    }

    return (
      <>
        <div style={{ paddingBottom: 10 }}>
          <Typography variant={windowDimensions.width < 1900 ? 'h5' : 'h4'} id='TypographyNeutro' paddingBottom={1}
            fontWeight={500} letterSpacing={'.2px'}>{'Listado de Ordenes'}
          </Typography>
          <Divider sx={{ width: 500 }} />
        </div>
        <Row>
          <Button name='buttonFilter' id='Filters' variant="contained" onFocus={() => handleOpenMenu()} >Filtros</Button>
          <Menu
            TransitionProps={{ timeout: 0 }}
            anchorEl={null}
            id="account-menu"
            open={menu}
            onClose={handleCloseMenu}
            PaperProps={{
              elevation: 0,
              sx: {
                minWidth: '30vw',
                backgroundColor: 'rgba(230, 242, 242) 0px 3px 12px 1px',
                borderRadius: '12px',
                boxShadow: 'rgba(230, 242, 242) 0px 3px 12px 1px',
                transition: 'none !important',
                overflow: 'visible',
                filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.12))',
              },
            }}
            anchorReference="anchorPosition"
            anchorPosition={{ top: clientXY[0] + 50, left: clientXY[1] }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Grid container paddingBottom={6}>
              <AppBar sx={{ boxShadow: 'none', backgroundColor: '#0C0C0C', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                  <Grid item xs={12} paddingLeft={5} display={'flex'} justifyContent={'center'}>
                    <Typography sx={{ fontFamily: 'M PLUS 2', fontSize: '20px', letterSpacing: '1px' }}>{'Filtros'}</Typography>
                  </Grid>
                  <Spacer css={{ flex: 1 }} />
                  <IconButton
                    onClick={handleCloseMenu}
                    aria-label="close"><Close sx={{ ':hover': { color: '#A3A3A3' } }} htmlColor='#C4C4C4' /></IconButton>
                </Toolbar>
              </AppBar>
            </Grid>
            <Grid container spacing={2} padding={2} >
              <Grid item xs={4}>
                <Typography id='Typography' sx={{ padding: .5 }}>{Sales.OrderType}</Typography>
                <TextField
                  id='OrderType'
                  name='OrderType'
                  fullWidth
                  select variant='filled'
                  InputProps={{ disableUnderline: true }}
                  sx={style}
                  onChange={({ target }) => handleOrderType(target)}
                  value={orderType2}
                  SelectProps={{
                    MenuProps:
                    {
                      disableScrollLock: false, TransitionProps: { timeout: 0 }, PaperProps: {
                        className: 'select', sx: {
                          borderRadius: '8px',
                          maxHeight: 300,
                          boxShadow: 'rgba(0,0,0,0.2) 0px 0px 15px 0px'
                        }
                      }
                    }
                  }}
                >
                  <MenuItem key={0} value={0} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Nunito Sans', fontWeight: 500, fontSize: '14px' }}> </MenuItem>
                  {
                    orderTypes?.map((orderType: any) => {
                      return (
                        <MenuItem key={orderType.Id} value={orderType.Id} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Nunito Sans', fontWeight: 500, fontSize: '14px' }}> {orderType.OrderType} </MenuItem>
                      );
                    })
                  }
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <Typography id='Typography' sx={{ padding: .5 }}>{'Concepto(Venta)'}</Typography>
                <TextField id='ConceptSale' fullWidth sx={style} variant='filled'
                  InputProps={{ disableUnderline: true, endAdornment: <IconButton onClick={() => { setConceptSale(''), setConceptSale2('') }}><HighlightOff sx={{ ':hover': { color: '#AFAFAF' } }} htmlColor='#C4C4C4' /></IconButton> }}
                  inputProps={{ maxLength: 100 }}
                  label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Concepto</Typography>}
                  value={sale2}
                  onChange={handleSale}
                  onKeyPress={handleSalePress}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography id='Typography' sx={{ padding: .5 }}>{'Concepto(Compra)'}</Typography>
                <TextField id='ConceptSale' fullWidth sx={style} variant='filled'
                  InputProps={{ disableUnderline: true, endAdornment: <IconButton onClick={() => { setConceptPurchase(''), setConceptPurchase2('') }}><HighlightOff sx={{ ':hover': { color: '#AFAFAF' } }} htmlColor='#C4C4C4' /></IconButton> }}
                  inputProps={{ maxLength: 100 }}
                  label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Concepto</Typography>}
                  value={purchase2}
                  onChange={handlePurchase}
                  onKeyPress={handlePurchasePress}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography id='Typography' sx={{ padding: .5 }}>{Sales.CompanyType}</Typography>
                <TextField
                  id='CompanyType'
                  name='CompanyType'
                  fullWidth
                  select variant='filled'
                  InputProps={{ disableUnderline: true }}
                  sx={style}
                  onChange={({ target }) => handleCompanyType(target)}
                  value={companyType2}
                  SelectProps={{
                    MenuProps:
                    {
                      disableScrollLock: false, TransitionProps: { timeout: 0 }, PaperProps: {
                        className: 'select', sx: {
                          borderRadius: '8px',
                          maxHeight: 300,
                          boxShadow: 'rgba(0,0,0,0.2) 0px 0px 15px 0px'
                        }
                      }
                    }
                  }}
                >
                  <MenuItem key={0} value={0} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Nunito Sans', fontWeight: 500, fontSize: '14px' }}> </MenuItem>
                  {
                    companyTypes?.map((company: any) => {
                      return (
                        <MenuItem key={company.Id} value={company.Id} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Nunito Sans', fontWeight: 500, fontSize: '14px' }}> {company.CompanyType} </MenuItem>
                      );
                    })
                  }
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <Typography id='Typography' sx={{ padding: .5 }}>{Sales.Name}</Typography>
                <TextField id='CompanyType' fullWidth sx={style} variant='filled'
                  InputProps={{ disableUnderline: true, endAdornment: <IconButton onClick={() => { setCompany(''), setCompany2('') }}><HighlightOff sx={{ ':hover': { color: '#AFAFAF' } }} htmlColor='#C4C4C4' /></IconButton> }}
                  inputProps={{ maxLength: 100 }}
                  label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Nombre de Compañia</Typography>}
                  value={company2}
                  onChange={handleCompany}
                  onKeyPress={handleCompanyPress}
                />
              </Grid>

            </Grid>

          </Menu>

          {/* <Tooltip title={<Typography id='TypographyNeutro' letterSpacing={'.5px'} fontSize={'11px'}>Borrado masivo de 1 o mas ventas seleccionados</Typography>} arrow placement="right">
            <span>
              <Button sx={{ marginLeft: 2 }} id='Button2' variant="contained" disabled={bulkList.length == 0}>{Sales.BulkDelete}</Button>
            </span>
          </Tooltip> */}
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
          <Button disabled={isLoading} id='Button2' variant="contained" onClick={() => handleRouter('/orders/register')}>
            {isLoading ? <CircularProgress color='inherit' size={25} thickness={4} /> : 'Nueva Orden'}</Button>
        </Row>
        <Divider sx={{ paddingBottom: 1 }} />
        <Spacer />
      </>
    );
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
          onChange={(event: React.ChangeEvent<unknown>, value: number) =>
            apiRef.current.setPage(value - 1)
          }
        />
      </Box>
    );
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
      await axios.put(`/api/sales`, { id, ErasedAt }).then(async (result) => {

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
        enqueueSnackbar('La orden ha sido borrado correctamente', {
          variant: 'success',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          }
        })
        handleClose()
        await mutate(`/api/sales`, orders, true);
      })

    }
    catch (err: any) {
      console.log(err)
    }
  }

  const titlesArray = ['Fecha de la Orden', 'Tipo de Orden', 'tipo de Empresa', 'Nombre de la Empresa',
    'Sucursal', 'Concepto (Orden de Venta)', 'Concepto (Orden de Compra)',
    'Transportista', 'Permiso/Flete', 'Costo de Flete', 'Producto', 'Cantidad', 'Precio Base Unitario',
    'VAT%', 'IEPS%', 'Precio Unitario', 'Precio Base Total', 'VAT%', 'IEPS%', 'Total', 'Fecha de Última Actualización']

  let values: any = []

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#0C0C0C ',
      color: theme.palette.common.white,
      fontSize: router.locale != 'en' ? 12 : 14,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: router.locale != 'en' ? 12 : 14,
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
              <StyledTableCell component="th" scope="row">{item.date}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.ordertype}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.companytype}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.company}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.subsidiary}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.conceptSale}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.conceptPurchase}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.carrier}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.charter}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.charterQuantityPrice}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.product}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.quantity}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.unitBase}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.vatTotalUnit}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.iepsUnit}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.totalUnitPrice}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.totalBase}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.vatTotal}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.iepsTotal}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.total}</StyledTableCell>
              <StyledTableCell component="th" scope="row">{item.updatedAt}</StyledTableCell>

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
            <StyledTableCell component="th" scope="row">{item.date}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.ordertype}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.companytype}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.company}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.subsidiary}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.conceptSale}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.conceptPurchase}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.carrier}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.charter}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.charterQuantityPrice}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.product}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.quantity}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.unitBase}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.vatTotalUnit}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.iepsUnit}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.totalUnitPrice}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.totalBase}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.vatTotal}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.iepsTotal}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.total}</StyledTableCell>
            <StyledTableCell component="th" scope="row">{item.updatedAt}</StyledTableCell>
          </StyledTableRow >
        )
      }
    }
  )];


  return (

    <>
      {
        openPDF
          ?
          <PDFLayout titles={titles} values={values} title={'Reporte de Orden'} />
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
                      {'Borrar Orden'}
                    </DialogTitle>
                  </Toolbar>
                </AppBar>
                <DialogContent sx={{ height: 150, width: 500, display: 'grid', placeItems: 'center' }}>
                  {
                    isLoadingDialog ? <CircularProgress size={50} color='inherit' /> :
                      <>
                        <Typography id='TypographyNeutro' fontWeight={500} textAlign={'left'}>
                          {'¿Esta seguro que desea borrar esta Orden?'}
                        </Typography>
                        <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Button variant="contained" id='Button2' sx={{ marginRight: 3 }} onClick={handleClose}>
                            {'No'}
                          </Button>
                          <Button variant="contained" id='Button2' onClick={handleDelete}>
                            {'Si'}
                          </Button>
                        </DialogActions>
                      </>
                  }
                </DialogContent>

              </Dialog>

              <DataGridPro
                checkboxSelection
                onSelectionModelChange={(row) => {
                  setBulkList(row);
                }}
                selectionModel={bulkList}
                pagination
                components={{ Pagination: CustomPagination, Toolbar: CustomToolbar }}
                sx={{ fontWeight: 500, fontSize: '14px', flex: 1, mx: 'auto', p: 1, width: '100%', minHeight: '70vh', border: 'none', fontFamily: 'Archivo' }}
                loading={isLoadingOrders}
                rows={rows.filter(f => f?.companytype_id == (companyType == 0 ? f.companytype_id : companyType) &&
                  f?.ordertype_id == (orderType == 0 ? f.ordertype_id : orderType) &&
                  f?.company?.toLowerCase().includes(company == '' ? f?.company.toLowerCase() : company?.toLowerCase()) &&
                  f?.conceptSale?.toLowerCase().includes(order == '' ? f?.conceptSale?.toLowerCase() : order?.toLowerCase()) &&
                  f?.conceptPurchase?.toLowerCase().includes(purchase == '' ? f?.conceptPurchase?.toLowerCase() : purchase?.toLowerCase()))}
                columns={[
                  {
                    field: 'id',
                    headerName: 'ID',
                    width: 150,
                    editable: false,
                    hide: true,
                  },
                  {
                    field: 'companytype_id',
                    headerName: 'companytype_id',
                    width: 150,
                    editable: false,
                    hide: true,
                  },
                  {
                    field: 'ordertype_id',
                    headerName: 'ordertype_id',
                    width: 150,
                    editable: false,
                    hide: true,
                  },
                  {
                    field: 'date',
                    headerName: 'Fecha de la Orden',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        {Sales.Date}
                      </div>
                    ),
                  },
                  {
                    field: 'ordertype',
                    headerName: 'Tipo de Orden',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        {Sales.OrderType}
                      </div>
                    )
                  },
                  {
                    field: 'companytype',
                    headerName: 'Tipo de Empresa',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        {Sales.CompanyType}
                      </div>
                    )
                  },
                  {
                    field: 'company',
                    headerName: 'Nombre de la Empresa',
                    width: 250,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        {Sales.Name}
                      </div>
                    )
                  },

                  {
                    field: 'subsidiary',
                    headerName: 'Sucursal',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        {Sales.Subsidiary}
                      </div>
                    )
                  },
                  {
                    field: 'conceptSale',
                    headerName: 'Concepto (Orden de Venta)',
                    width: 250,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        {'Concepto(Orden de Venta)'}
                      </div>
                    )
                  },
                  {
                    field: 'conceptPurchase',
                    headerName: 'Concepto (Orden de Compra)',
                    width: 250,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        {'Concepto(Orden de Compra)'}
                      </div>
                    )
                  },
                  {
                    field: 'carrier',
                    headerName: 'Transportista',
                    width: 250,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        {Sales.Carrier}
                      </div>
                    )
                  },
                  {
                    field: 'charter',
                    headerName: 'Permiso/Flete',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        {Sales.Charter}
                      </div>
                    )
                  },
                  {
                    field: 'charterQuantityPrice',
                    headerName: 'Costo de Flete',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        {'Costo de Flete'}
                      </div>
                    )
                  },
                  {
                    field: 'product',
                    headerName: 'Producto',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        {'Producto'}
                      </div>
                    )
                  },
                  {
                    field: 'quantity',
                    headerName: 'Cantidad',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        Cantidad
                      </div>
                    ),

                  },
                  {
                    field: 'unitBase',
                    headerName: 'Precio Base Unitario',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        Precio Base Unitario
                      </div>
                    ),

                  },
                  {
                    field: 'vatTotalUnit',
                    headerName: 'VAT%',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        VAT %
                      </div>
                    ),

                  },
                  {
                    field: 'iepsUnit',
                    headerName: 'IEPS%',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        IEPS %
                      </div>
                    ),

                  },
                  {
                    field: 'totalUnitPrice',
                    headerName: 'Precio Unitario',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        Precio Unitario
                      </div>
                    ),

                  },
                  {
                    field: 'totalBase',
                    headerName: 'Precio Base Total',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        Precio Base Total
                      </div>
                    )
                  },
                  {
                    field: 'vatTotal',
                    headerName: 'VAT%',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        VAT %
                      </div>
                    )
                  },
                  {
                    field: 'iepsTotal',
                    headerName: 'IEPS%',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        IEPS %
                      </div>
                    )
                  },

                  {
                    field: 'total',
                    headerName: 'Total',
                    width: 200,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        Total
                      </div>
                    )
                  },
                  {
                    field: 'updatedAt',
                    headerName: 'Fecha de Última Actualización',
                    width: 250,
                    editable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        Fecha de Última Actualización
                      </div>
                    )
                  },
                  {
                    field: 'actions',
                    type: 'actions',
                    width: 120,
                    headerName: '',
                    renderHeader: () => (
                      <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                        Acciones
                      </div>
                    ),
                    getActions: ({ id }) => [
                      <>
                        {
                          <>
                            <GridActionsCellItem disabled={isLoadingToRegiser || isLoadingDialog} icon={<Tooltip arrow placement='left' title={<Typography id='TypographyNeutro' fontSize={'12px'}>{'Editar'}</Typography>}>{id == idEdit && isLoadingToEdit ? <CircularProgress color="inherit" thickness={5} size={20} /> : <EditIcon />}</Tooltip>} key={Number(id) + Math.random()} onClick={() => { setIdEdit(Number(id)), handleRouter(`/orders/edit/${id}`) }} sx={{ ':hover': { color: 'green' }, color: "#393939", p: 1 }} label="Edit" />
                          </>
                        }
                        {
                          <>
                            <GridActionsCellItem disabled={isLoadingToRegiser || isLoadingDialog} icon={<Tooltip arrow placement='right' title={<Typography id='TypographyNeutro' fontSize={'12px'}>{'Borrar'}</Typography>}><DeleteIcon /></Tooltip>} key={Number(id) + Math.random()} onClick={() => { handleOpenDialog(1), setIdDelete(Number(id)) }} sx={{ ':hover': { color: 'red' }, color: "#393939", p: 1 }} label="Delete" />
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
  try {
    await jwt.isValidToken(token);
    isValidToken = true;

  } catch (error) {
    isValidToken = false;

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
    props: { Sales: response.default.Sales }
  }
}
