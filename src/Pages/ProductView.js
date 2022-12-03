import React from 'react'
import { Button, Grid, Rating, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useNavigate } from "react-router-dom";

const ProductView = () => {
    const navigate = useNavigate(); 
  return (
    <div>
    <Grid container spacing={5}>
    <Grid item md={3}>
    <Box 
    marginTop={"100px"}
    sx={{width:"100%"}}
    sy={{width:"75%"}}
    component="img" 
    src={require("./images/dslr.png")}/>
    <Typography variant="h6" sx={{fontWeight: "bold"}}>
    Nikon camera 
    </Typography>
    <Typography variant="subtitle2"> 
    See your photos and videos come to life with stunning clarity and rich detail through 
    masterly-crafted Nikon DSLR cameras and world-renowned NIKKOR lenses.
    </Typography>
    <Typography variant="h5" sx={{fontWeight:"bold"}} >
    $200.00
    </Typography>
    <Typography variant="subtitle2" sx={{color:"gray"}}>
    Standard shipping 
    </Typography>
    <Box 
    sx={{
        display: "flex",
        alignItems:"center"
    }}
    >
    
    </Box>
    <Box sx={{display:"block"}}>
    <Button size="small" onClick={()=>navigate('/addreviews')}>Write Review</Button>
    </Box>
    </Grid>


    <Grid item md={3}>
    <Box 
    marginTop={"100px"}
    sx={{width:"100%"}}
    sy={{width:"75%"}}
    component="img" 
    src={require("./images/cctv.png")}/>
    <Typography variant="h6" sx={{fontWeight: "bold"}}>
    CCTV 
    </Typography>
    <Typography variant="subtitle2"> 
    1080p HD video. A 140° ultra-wide field of view. Plus digital zoom and full color 
    vision at night, so nothing slips by undetected.
    </Typography>
    <Typography variant="h5" sx={{fontWeight:"bold"}} >
    $70.00
    </Typography>
    <Typography variant="subtitle2" sx={{color:"gray"}}>
    Standard shipping 
    </Typography>
    <Box 
    sx={{
        display: "flex",
        alignItems:"center"
    }}
    >
    </Box>
    <Box sx={{display:"block"}}>
    <Button size="small">Write Review</Button>
    </Box>
    </Grid>
    <Grid item md={3}>
    <Box 
    marginTop={"100px"}
    sx={{width:"100%"}}
    sy={{width:"75%"}}
    component="img" 
    src={require("./images/polaroid.png")}/>
    <Typography variant="h6" sx={{fontWeight: "bold"}}>
    Polaroid camera 
    </Typography>
    <Typography variant="subtitle2"> 
    Great for your everyday photograpy and make memories with it
    </Typography>
    <Typography variant="h5" sx={{fontWeight:"bold"}} >
    $85.00
    </Typography>
    <Typography variant="subtitle2" sx={{color:"gray"}}>
    Standard shipping 
    </Typography>
   
    <Box sx={{display:"block"}}>
    <Button size="small">Write Review</Button>
    </Box>
    </Grid>
   
    </Grid>
    
    </div>
  )
}

export default ProductView