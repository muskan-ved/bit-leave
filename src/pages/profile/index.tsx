// ** React Imports
import React, { useContext, useState } from 'react';

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import { Typography, Box, Grid, CardHeader, Card, CardContent, Divider,styled ,AvatarProps, FormControl, Button} from '@mui/material';

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Axios Imports
import axios from 'axios';

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)<AvatarProps>(({ theme }) => ({
	width: 50,
	height: 50,
}))

const Profile = () => {

	const [imagePreviewUrl,setImagePreviewUrl] = useState('');

	const ability = useContext(AbilityContext)
	const employee_img = "/images/avatars/1.png";
	const userData = localStorage.getItem("userData")
	const token = localStorage.getItem("accessToken")

	var data;
	if (userData != null) {
		data = JSON.parse(userData)
	}

	const handleOnChange = async(event: any) => {
		event.preventDefault();

		let reader = new FileReader();
		let file = event.target.files[0];
		
		  reader.onloadend = (e:any) => {
			let image = e.target.result
			setImagePreviewUrl(image);
		  };
		  reader.readAsDataURL(file);

		await axios.put('endpoint',
		{file}, 
		{
			headers: { 'Authorization': `Bearer ${token}` }
        })
		  
		}

	return (<>
		{ability?.can('read', 'analytics') ? (
			<Card>
				<CardHeader title='To upload a logo please click on upload button' subheader={<Divider></Divider>}></CardHeader>
				<CardContent sx={{m:3 , p:3}} >
					<Box sx={{  width: '100%' }}>
					{imagePreviewUrl ? <Avatar src={imagePreviewUrl}  skin='light' variant='rounded' sx={{ width: 100, height: 100 }} />:null}
					</Box>
				</CardContent>
				<Box sx={{ m: 3, p: 3 }} className="btndivider">
					<Button variant="contained" component="label">
						Upload
						<input style={{ marginLeft: 60 }} type={"file"} id={"logo"} onChange={handleOnChange}  hidden />
					</Button>
				</Box>
			</Card>				
			 ) : ( 
		 <Card>
			<CardHeader title='Profile' subheader={<Divider></Divider>} />
			<CardContent>
				<Box sx={{ mb: '30px' }}>
					<Avatar src={data.avatar ? data.avatar : employee_img} skin='light' variant='rounded' />
				</Box>
				<Box sx={{ mb: '10px' }}>
					<Typography variant="body1" sx={{ width: '200px', display: 'inline-block', verticalAlign: 'middle' }}>Fullname</Typography> :
					<Typography variant='body2' component="span" sx={{ ml: 8, verticalAlign: 'middle' }}>{data?.fullName} </Typography>
				</Box>
				<Box sx={{ mb: '10px' }}>
					<Typography variant="body1" sx={{ width: '200px', display: 'inline-block', verticalAlign: 'middle' }}>Company Name </Typography> :
					<Typography variant='body2' component="span" sx={{ ml: 8, verticalAlign: 'middle' }}>{data?.companyname} </Typography>
				</Box>
				<Box sx={{ mb: '10px' }}>
					<Typography variant="body1" sx={{ width: '200px', display: 'inline-block', verticalAlign: 'middle' }}>Username </Typography> :
					<Typography variant='body2' component="span" sx={{ ml: 8, align: 'middle' }}>{data?.username}</Typography>
				</Box>
				<Box sx={{ mb: '10px' }}>
					<Typography variant="body1" sx={{ width: '200px', display: 'inline-block', verticalAlign: 'middle' }}>Email</Typography> :
					<Typography variant='body2' component="span" sx={{ ml: 8, verticalAlign: 'middle' }}>{data?.email}</Typography>
				</Box>
			</CardContent>
		</Card> 
		  )} 
	</>
	);
}

Profile.acl = {
	action: 'read',
	subject: 'profile'
}


export default Profile;