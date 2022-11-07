// ** React Imports
import React, { SyntheticEvent, useState, useEffect } from 'react'
import axios, { AxiosError } from "axios";
import dynamic from 'next/dynamic'
import { EditorProps } from 'react-draft-wysiwyg'

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";

const htmlToDraft = typeof window === 'object' && require('html-to-draftjs').default;

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import CircularProgress from '@mui/material/CircularProgress'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Button from '@mui/material/Button'
import TabContext from '@mui/lab/TabContext'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'

// ** Icons Imports
import ChevronDown from 'mdi-material-ui/ChevronDown'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** config import
import API from '../../configs/apiEndpoints'

// ** Toaster import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import * as gtag from '../../lib/gtag'


const Templates = () => {
  // ** State
  const [value, setValue] = useState<string>('0')
  const [firstexpanded, setFirstExpanded] = useState<string | false>("panel2")
  const [getTabList, setTabList] = useState<string[]>([])
  const [getdata, setGetData] = useState<any[]>([])
  const [editorState, setEditorState] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const token = localStorage.getItem("accessToken")

  if (firstexpanded) { }

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  const { logout } = useAuth()

  const fetchData = async () => {

    axios
      .get(API.loadOrganisation, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        const data = res.data.data[0].organisationstemplates;
        const editorState: any[] = []
        const tabList: string[] = []
        setIsLoading(false);
        setTabList([]);
        setEditorState([]);
        data.map((value: any, i: number) => {
          if (!tabList.find(x => x === value.templatetype)) {
            tabList.push(value.templatetype);
          }
          const contentBlocks = htmlToDraft(value.defaulttext)
          value.index = i;
          value.updateEditorState = EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocks))
          editorState.push(value.updateEditorState);
        });
        setEditorState(editorState);
        setTabList(tabList);
        setGetData(data);
      })
      .catch((reason: AxiosError) => {
        if (reason.response && reason.response!.status === 401) {
          logout();
        } else {
          // Handle else
        }
      });
  };
  const updateData = async () => {
    const organisationstemplates = [];
    for (let i = 0; i < getdata.length; i++) {
      const data = {
        "id": getdata[i].id,
        "text": draftToHtml(convertToRaw(editorState[i].getCurrentContent()))
      }
      organisationstemplates.push(data);
    }
    gtag.event({
      action: 'templates_update',
      category: 'templates',
      label: "templates_update",
      value:'templates_update'
    })
    setLoading(true)
    axios.patch(API.updateTemplateData, organisationstemplates, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        toast.success("Successfully updated templates");
        setLoading(false)
        fetchData();
      })
      .catch((err) => {
        setLoading(false)
        toast.error("Failed to updated templates")
      })

  }
  const handleFirstChange = (panel1: string) => (event: SyntheticEvent, isFirstExpanded: boolean) => {
    if (event) { }
    setFirstExpanded(isFirstExpanded ? panel1 : false)
  }

  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    if (event) { }
    setValue(newValue)
  }
  if (isLoading)
    return (<CircularProgress color="success" />)

  if (!isLoading && getdata.length == 0) {

    return (
      <Grid container spacing={6}>
        <Grid item md={12} xs={12}>
          <Card>
            <CardHeader title='Your Dashboard' />
            <CardContent>
              <Typography sx={{ mb: 4 }}>You are not fully onboarded !</Typography>
              <Typography>Please use the sync org functionality to upload your and other employee details.</Typography>
              <br />
            </CardContent>
          </Card>
        </Grid>
      </Grid>)
  }

  return (
    <Card>
       <CardHeader title='Manage Email Templates' subheader={<Divider></Divider>} />
      <ToastContainer  />
      <TabContext value={value}>
        <TabList onChange={handleChangeTab} aria-label='card navigation example'>
          {getTabList && getTabList.map((data: string, i: any) =>
            <Tab key={i} value={i.toString()} label={data} />)}
        </TabList>
        <CardContent>
          {getTabList && getTabList.map((data: string, i: any) =>
            <TabPanel key={i} value={i.toString()} sx={{ p: 0 }}>
              {getdata && getdata.filter(x => x.templatetype === data).map((templtedata: any, i: any) =>
                <Accordion key={templtedata.index} onChange={handleFirstChange("panel2")}>
                  <AccordionSummary
                    expandIcon={<ChevronDown />}
                    id='form-layouts-collapsible-header-1'
                    aria-controls='form-layouts-collapsible-content-1'
                  >
                    <Typography key={templtedata.index} variant='subtitle1' sx={{ fontWeight: 500 }}>
                      {templtedata.templatename}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 6, pb: 6 }}>
                    <Editor editorStyle={{ border: "1px solid", minHeight: '100px' }}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName" onEditorStateChange={(e: EditorState) => {
                        const items = [...editorState];
                        items[templtedata.index] = e;
                        setEditorState(items);

                      }} editorState={editorState[templtedata.index]}></Editor><br />
                  </AccordionDetails><br />
                </Accordion>
              )}
            </TabPanel>
          )} <br />
          {!loading ? <Button onClick={updateData} variant='contained' >Update</Button> : 
           <LoadingButton loading={loading} size='large' type='submit' variant='contained' disabled>
                  Update
            </LoadingButton>}
        </CardContent>
      </TabContext>
    </Card >
  )
}
Templates.acl = {
  action: 'manage',
  subject: 'Thresholds'
}

export default Templates
