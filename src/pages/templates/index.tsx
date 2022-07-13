// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Axios
import axios, { AxiosError } from 'axios'

// ** React Imports
import React, { SyntheticEvent, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { EditorProps } from 'react-draft-wysiwyg'
const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState, convertFromRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
const htmlToDraft = typeof window === 'object' && require('html-to-draftjs').default;


// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import Divider from '@mui/material/Divider'


// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Button from '@mui/material/Button'
import TabContext from '@mui/lab/TabContext'

// ** Icons Imports
import ChevronDown from 'mdi-material-ui/ChevronDown'
import { CosineWave } from 'mdi-material-ui';


const Templates = () => {
  // ** State
  const [value, setValue] = useState<string>("0")
  const [firstexpanded, setFirstExpanded] = useState<string | false>("panel2")
  const [getdata, setGetData] = useState<any[]>([])
  const [editorState, setEditorState] = useState<any[]>([])
  const [editor, setEditor] = useState(EditorState.createEmpty())
  const token = localStorage.getItem("accessToken")
  const baseUrl = 'https://api.bitleave.co/organisations/1'
  const updateBaseUrl = "https://api.bitleave.co/organisations/templates"
  const {logout} = useAuth()
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    axios
      .get(baseUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        const data = res.data.data.organisation.organisationstemplates;
        const editorState: any[] = []
        setEditorState([]);
        data.map((value: any) => {
          const contentBlocks = htmlToDraft(value.defaulttext)
          const contentState = ContentState.createFromBlockArray(contentBlocks)
          value.updateEditorState = EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocks))
          editorState.push(value.updateEditorState);
        });
        setEditorState(editorState);
        setGetData(data);

      })
      .catch((reason: AxiosError) => {
        console.log(reason)
        if (reason.response!.status === 401) {
          logout()
        } else {
          // Handle else
        }
      }
      );
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
        alert("Data Updated Successfully")
        console.log(res)
      })
      .catch((err) => {
        alert("Error occured while updating data")
        console.log(err)
      })

  }
  const handleFirstChange = (panel1: string) => (event: SyntheticEvent, isFirstExpanded: boolean) => {
    setFirstExpanded(isFirstExpanded ? panel1 : false)
  }

  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  if (!getdata) {
    return (
      <Grid container spacing={6}>
        <Grid item md={12} xs={12}>
          <Card>
            <CardHeader title='Your Dashboard' />
            <CardContent>
              <Typography sx={{ mb: 4 }}>No templates exist for your organisation !</Typography>
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
          {getdata && getdata.map((data: any, i: any) =>
            <Tab value={i} label={data.templatetype} />)}

        </TabList>
        <CardContent>
          {getdata && getdata.map((data: any, i: any) =>
            <TabPanel value={i} sx={{ p: 0 }}>
              <Accordion onChange={handleFirstChange("panel2")}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  id='form-layouts-collapsible-header-1'
                  aria-controls='form-layouts-collapsible-content-1'
                >
                  <Typography key={i} variant='subtitle1' sx={{ fontWeight: 500 }}>
                    {data.templatename}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 6, pb: 6 }}>
                  <Editor editorStyle={{ border: "1px solid", minHeight: '100px' }}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName" onEditorStateChange={(e: EditorState) => {
                      let items = [...editorState];
                      items[i] = e;
                      setEditorState(items);
                    }} editorState={editorState[i]}></Editor><br />
                </AccordionDetails>
              </Accordion>
            </TabPanel>)}<br />
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
