import { GetServerSideProps } from "next";
import { jwt } from "../../../utils";
import { DataGridPro, GridActionsCell, GridActionsCellItem, gridPageCountSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid-pro";
import { AppBar, Button, Card, CircularProgress, Divider, Grid, IconButton, Menu, MenuItem, Pagination, Toolbar, Tooltip, Typography, TextField, createTheme, alpha } from '@mui/material';
import { Layout } from "../../../components/layouts";
import { useEffect, useState } from "react";
import { useSales } from "../../../hooks/useSales";
import Box from '@mui/material/Box';
import { Row, Spacer } from "@nextui-org/react";
import { useRouter } from "next/router";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Close, HighlightOff } from "@mui/icons-material";
import { useCompanyTypes } from "../../../hooks/useCompanyTypes";

export default function ProductList(props: any) {

  const router = useRouter()

  const { companyTypes, isLoadingCompanyTypes } = useCompanyTypes(`/companytypes`)

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

  const { sales, isLoadingSales } = useSales(`/sales`)

  function formatmmddyy(date: any) {
    if (!date) {
      return ''
    }
    date = new Date(date);
    //suma dia en server
    // date.setDate(date.getDate() + 1);
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    return (day + '/' + month + '/' + year);
  }
  
  const rows = (sales || []).map(dataRow => {
    return {
      id: dataRow.id,
      date: formatmmddyy(dataRow.date),
      orderType: dataRow.orderType,
      companyType: dataRow.companyType,
      name: dataRow.name,
      branch: dataRow.branch,
      charter: dataRow.charter,
      salesConcept: dataRow.salesConcept,
      purchaseConcept: dataRow.purchaseConcept,
      product: dataRow.product,
      iepsPercentage: dataRow.iepsPercentage,
      vatPercentage: dataRow.vatPercentage,
      quantity: dataRow.quantity,
      baseUnitPrice: dataRow.baseUnitPrice,
      vatPercentageSale: dataRow.vatPercentageSale,
      iepsPercentageSale: dataRow.iepsPercentageSale,
      totalUnitPrice: dataRow.totalUnitPrice,
      base: dataRow.base,
      vatPercentagePurchase: dataRow.vatPercentagePurchase,
      iepsPercentagePurchase: dataRow.iepsPercentagePurchase,
      total: dataRow.total,
      carrier: dataRow.carrier,
      shipping: dataRow.shipping,
      shippingCost: dataRow.shippingCost,
      companytype_id : dataRow.companytype_id,
      ordertype_id : dataRow.ordertype_id

    };
  });

  const [clientXY, setClientXY] = useState([0, 0]);
  const [menu, openMenu] = useState(false);

  const [companyType, setCompanyType] = useState(0)
  const [company, setCompany] = useState('')
  const [sale, setConceptSale] = useState('')
  const [purchase, setConceptPurchase] = useState('')

  function CustomToolbar() {
    
    const apiRef = useGridApiContext();

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
    const [company2, setCompany2] = useState(company)
    const [sale2, setConceptSale2] = useState(sale)
    const [purchase2, setConceptPurchase2] = useState(purchase)

    const handleCompanyType = (event: any) => {
      setCompanyType(event.value)
      setCompanyType2(event.value)
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
            fontWeight={500} letterSpacing={'.2px'}>{ }
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
                minWidth: '20vw',
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
                    <Typography sx={{ fontFamily: 'M PLUS 2', fontSize: '20px', letterSpacing:'1px' }}>{'Filtros'}</Typography>
                  </Grid>
                  <Spacer css={{ flex: 1 }} />
                  <IconButton
                    onClick={handleCloseMenu}
                    aria-label="close"><Close sx={{ ':hover': { color: '#A3A3A3' } }} htmlColor='#C4C4C4' /></IconButton>
                </Toolbar>
              </AppBar>
            </Grid>
            <Grid container spacing={2} padding={2} >
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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
              <Grid item xs={6}>
                <Typography id='Typography' sx={{ padding: .5 }}>{Sales.SalesConcept}</Typography>
                <TextField id='CompanyType' fullWidth sx={style} variant='filled'
                  InputProps={{ disableUnderline: true, endAdornment: <IconButton onClick={() => { setConceptSale(''), setConceptSale2('') }}><HighlightOff sx={{ ':hover': { color: '#AFAFAF' } }} htmlColor='#C4C4C4' /></IconButton> }}
                  inputProps={{ maxLength: 100 }}
                  label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Concepto (Venta)</Typography>}
                  value={sale2}
                  onChange={handleSale}
                  onKeyPress={handleSalePress}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography id='Typography' sx={{ padding: .5 }}>{Sales.PurchaseConcept}</Typography>
                <TextField id='CompanyType' fullWidth sx={style} variant='filled'
                  InputProps={{ disableUnderline: true, endAdornment: <IconButton onClick={() => { setConceptPurchase(''), setConceptPurchase2('') }}><HighlightOff sx={{ ':hover': { color: '#AFAFAF' } }} htmlColor='#C4C4C4' /></IconButton> }}
                  inputProps={{ maxLength: 100 }}
                  label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Concepto (Compra)</Typography>}
                  value={purchase2}
                  onChange={handlePurchase}
                  onKeyPress={handlePurchasePress}
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
          <Button disabled={isLoading} id='Button2' variant="contained" onClick={() => handleRouter('/sales/register')}>
            {isLoading ? <CircularProgress color='inherit' size={25} thickness={4} /> : Sales.Register}</Button>
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

  return (
    <Layout>
      <DataGridPro
        checkboxSelection
        onSelectionModelChange={(row) => {
          setBulkList(row);
        }}
        selectionModel={bulkList}
        pagination
        components={{ Pagination: CustomPagination, Toolbar: CustomToolbar }}
        sx={{ fontWeight: 500, fontSize: '14px', flex: 1, mx: 'auto', p: 1, width: '100%', minHeight: '70vh', border: 'none', fontFamily: 'Archivo' }}
        loading={isLoadingSales}
        rows={rows.filter(f => f.companytype_id == (companyType == 0 ? f.companytype_id : companyType) &&
          f?.name?.toLowerCase().includes(company == '' ? f?.name.toLowerCase() : company?.toLowerCase()) &&
          f?.salesConcept?.toLowerCase().includes(sale == '' ? f?.salesConcept?.toLowerCase() : sale?.toLowerCase()) &&
          f?.purchaseConcept?.toLowerCase().includes(purchase == '' ? f?.purchaseConcept?.toLowerCase() : purchase?.toLowerCase()))}
        columns={[
          {
            field: 'id',
            headerName: 'ID',
            width: 150,
            editable: false,
            hide: true,
          },
          {
            field: 'date',
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
            field: 'orderType',
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
            field: 'companyType',
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
            field: 'name',
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
            field: 'branch',
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
            field: 'salesConcept',
            width: 200,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => (
              <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                {Sales.SalesConcept}
              </div>
            )
          },
          {
            field: 'purchaseConcept',
            width: 200,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => (
              <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                {Sales.PurchaseConcept}
              </div>
            )
          },
          {
            field: 'iepsPercentage',
            width: 200,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => (
              <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                {Sales.IEPSProduct}
              </div>
            )
          },
          {
            field: 'vatPercentage',
            width: 200,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => (
              <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                {Sales.VATCompany}
              </div>
            )
          },
          {
            field: 'quantity',
            width: 200,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => (
              <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                {Sales.Liters}
              </div>
            )
          },
          {
            field: 'charter',
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
            field: 'vatPercentageSale',
            headerName: 'VAT Percentage Sale',
            width: 250,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => (
              <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                {Sales.VATBase}
              </div>
            )
          },
          {
            field: 'iepsPercentageSale',
            headerName: 'IEPS Percentage Sale',
            width: 250,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => (
              <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                {Sales.IEPSBase}
              </div>
            )
          },
          {
            field: 'totalUnitPrice',
            headerName: 'Total Unit Price',
            width: 200,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => (
              <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                {Sales.TotalUnitPrice}
              </div>
            )
          },
          {
            field: 'base',
            headerName: 'Base',
            width: 200,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => (
              <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                {Sales.Base}
              </div>
            )
          },
          {
            field: 'vatPercentagePurchase',
            headerName: 'VAT Percentage Purchase',
            width: 250,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => (
              <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                {Sales.VATTotal}
              </div>
            )
          },
          {
            field: 'iepsPercentagePurchase',
            headerName: 'IEPS Percentage Purchase',
            width: 250,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => (
              <div style={{ color: '#505050', fontSize: 'medium', fontWeight: 'bold' }}>
                {Sales.IEPSTotal}
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
                {Sales.Total}
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
                { }
              </div>
            ),
            getActions: ({ id }) => [
              <>
                {
                  <>
                    <GridActionsCellItem disabled={isLoadingToRegiser || isLoadingDialog} icon={<Tooltip arrow placement='left' title={<Typography id='TypographyNeutro' fontSize={'12px'}>{'EDIT'}</Typography>}>{id == idEdit && isLoadingToEdit ? <CircularProgress color="inherit" thickness={5} size={20} /> : <EditIcon />}</Tooltip>} key={Number(id) + Math.random()} onClick={() => { setIdEdit(Number(id)), handleRouter(`/sales/edit/${id}`) }} sx={{ ':hover': { color: 'green' }, color: "#393939", p: 1 }} label="Edit" />
                  </>
                }
                {
                  <>
                    <GridActionsCellItem disabled={isLoadingToRegiser || isLoadingDialog} icon={<Tooltip arrow placement='right' title={<Typography id='TypographyNeutro' fontSize={'12px'}>{'DELETE'}</Typography>}><DeleteIcon /></Tooltip>} key={Number(id) + Math.random()} onClick={() => { handleOpenDialog(1), setIdDelete(Number(id)) }} sx={{ ':hover': { color: 'red' }, color: "#393939", p: 1 }} label="Delete" />
                  </>
                }

              </>
            ],
          },
        ]}
      />
    </Layout>
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
