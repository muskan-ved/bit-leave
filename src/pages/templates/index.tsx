// ** React Imports
import React, { SyntheticEvent, useState, useEffect } from 'react'
import axios from "axios";
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


const Templates = () => {
  // ** State
  const [value, setValue] = useState<string>('0')
  const [firstexpanded, setFirstExpanded] = useState<string | false>("panel2")
  const [getTabList, setTabList] = useState<string[]>([])
  const [getdata, setGetData] = useState<any[]>([])
  const [editorState, setEditorState] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const token = localStorage.getItem("accessToken")
  const baseUrl = 'https://api.bitleave.co/organisations/'
  const updateBaseUrl = "https://api.bitleave.co/organisations/templates"
  if (firstexpanded) { }

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    const userData = localStorage.getItem("userData")
    let id;
    if (userData != null) {
      const data = JSON.parse(userData)
      id = data.orgId;
    }
    axios
      .get(baseUrl + id, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        const data = res.data.data.organisation.organisationstemplates
        const editorState: any[] = []
        const tabList: string[] = []
        setTabList([]);
        setEditorState([]);
        data.map((value: any, i: number) => {
          if (!tabList.find(x => x === value.templatetype)) {
            tabList.push(value.templatetype);
          }
          const contentBlocks = htmlToDraft(value.defaulttext)
          const contentState = ContentState.createFromBlockArray(contentBlocks)

          value.index = i;
          value.updateEditorState = EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocks))
          editorState.push(value.updateEditorState);
        });
        setEditorState(editorState);
        setTabList(tabList);
        setGetData(data);
        console.log('HERE ' + getdata);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateData = async () => {
    const organisationstemplates = [];
    for (let i = 0; i < getdata.length; i++) {
      const data = {
        "id": getdata[i].id,
        "defaulttext": draftToHtml(convertToRaw(editorState[i].getCurrentContent()))
      }
      organisationstemplates.push(data);
    }
    const data = {
      "organisationstemplates": organisationstemplates
    }
    axios.put(updateBaseUrl, data, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res) { }
        alert("Data Updated Successfully")
      })
      .catch((err) => {
        alert("Error occured while updating data")
        console.log(err)
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
          <Button onClick={updateData} variant='contained'>Update</Button>
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
