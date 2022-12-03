import React from 'react'
import { Box, Stack, TextField, Rating, Typography } from '@mui/material';
import Input from '@mui/material/Input';
import { Button } from '@mui/material';
import './AddReviews.css'
import { useNavigate } from 'react-router-dom'
import Records from '../reviews.json'
import {useState} from 'react';

import { getAllUsers} from '../services/getData'
// import { getSummary} from '../services/getSummary'
function AddReviews() {
    // const inputProps = {
    //     step: 300,
    //   };
  const [RecordText, setRecordText] = useState(false);
  const[reviewText, setReviewText] = useState('');
  const navigate = useNavigate();

  const addrev = Object.keys(Records)
  console.log(addrev)
  const viewReview = JSON.stringify(Records)
  console.log(viewReview);
  const rev = JSON.parse(viewReview)
  console.log(rev);
  console.log(typeof(rev))
  let txt=Object.values(rev)
  console.log(txt)
  // for(var i in rev){
  //   txt += rev[i]
  // }
    

  
  console.log(txt)
    
    // console.log(viewReview)
    // console.log(typeof(rev))
    // const newArr = Object.keys(rev).map((key) => [rev[key]])
    // console.log(newArr)
  // console.log(Records.content2);
  // const sum = []


  // sum = Records[2]
  // console.log("review" + sum)

  //function to display the reviews
  const saveReviews = () =>{
    alert("Success, your review is submitted!")
  }
  const displayReviews = (e)=>{
    let data = txt
    getAllUsers(data).then((data) => {
      console.log(data);
    })
    e.preventDefault();
    setReviewText('')
    // console.log("hi");
    // console.log(Records);
    setRecordText(true);
    // Records && Records.map(record => {
    //   console.log(record.id);
    //   return(
    //     <div className='box' key={record.id}>
    //     <strong>{record.title}</strong><br/>
    //     {record.content}<br></br>
    //     </div>
    //   )
    // })
  };

  // const summarizeReviews = (e)=>{
  //   e.preventDefault();
  //   let test = ["camera is bad","camera is good","batteries bad","Camera is good but batteries are bad","Batteries are dead"]
  //   getSummary(test).then((test) => {
  //     console.log(test);
  //   })

  // }
  //function to capture the review text
  const handleChange = (e) =>{
    e.preventDefault();
    setReviewText(e.target.value)

    // console.log(reviewText)
    // return reviewtxt

  };
  return (
    <div>
    <h4> Add a review</h4>
    <Stack direction={'column'} spacing={2}>
    <div className='reviewText'>
    <TextField value={reviewText} multiline="true" rows={5}  style = {{width: 800}} onChange={handleChange} />
    </div>
    <Box 
    sx={{
        display: "flex",
        alignItems:"center"
    }}
    >
    
    <Button size='small' onClick={saveReviews}> Submit </Button>
    <Button size='small' onClick={displayReviews}>View reviews </Button>
    <Button size="small" onClick={()=>{navigate('/viewReviews')}}>View Summary</Button>
    { RecordText ? Records.map(record => {

        return(
        <div>
        <br></br>
        
        <p><strong>Product name:</strong>{record.title}</p>

        
        <p><strong>Reviews:</strong></p>
        <p>{record.content1}</p>
        <p>{record.content2}</p>
        <p>{record.content3}</p>
        <p>{record.content4}</p>
        <p>{record.content5}</p>
        <p>{record.content6}</p>
        <p>{record.content7}</p>
        <p>{record.content8}</p>
        <p>{record.content9}</p>
        <p>{record.content10}</p>
        <br /> <br/>
        
        </div>
     ) })
        : null }
    
    </Box>
    </Stack>
    </div>
  )
}

export default AddReviews