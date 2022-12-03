import React, {Component} from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper} from '@mui/material'
import { getAllUsers} from '../services/getData'
import Records from '../reviews.json'

class Tablegenerate extends Component {
  render() {
      var heading = this.props.heading;
      var body = this.props.body;
      const addrev = Object.keys(Records)
  const viewReview = JSON.stringify(Records)
  const rev = JSON.parse(viewReview)
  let text=Object.values(rev)
  let data = [];
  for(let i=1;i<29;i++){
    data.push(text[0]["content"+i])
  }
  console.log(data)
   const tabularData = [{
    "id": 1,
    "Aspect": "product",
    "Feature_1": "bad",
    "Feature_2": "nice",
    "Feature_3": "best",
    "Feature_4": "great",
    "Feature_5": "fine",
    "Overall_Sentiment": "positive"
  }, {
    "id": 2,
    "Aspect": "camera",
    "Feature_1": "bad",
    "Feature_2": "good",
    "Feature_3": "perfect",
    "Feature_4": "average",
    "Feature_5": "awesome",
    "Overall_Sentiment": "positive"
  }, {
    "id": 3,
    "Aspect": "batteries",
    "Feature_1": "good",
    "Feature_2": "bad",
    "Feature_3": "durable",
    "Feature_4": "average",
    "Feature_5": "low",
    "Overall_Sentiment": "negative"
  }, {
    "id": 4,
    "Aspect": "price",
    "Feature_1": "reasonable",
    "Feature_2": "worth",
    "Feature_3": "low",
    "Feature_4": "nice",
    "Feature_5": "fine",
    "Overall_Sentiment": "positive"
  }]
  getAllUsers(data).then((data) => {
    //console.log(data);
   
   
    // for(const property in data){
    //   let obj = {};
    //   obj["Aspect"] = property
    //   obj["Feature_1"] = data[property][0]
    //   obj["Feature_2"] = data[property][1]
    //   obj["Feature_3"] = data[property][2]
    //   obj["Overall_Sentiment"] = data[property][3]
    //   tabularData.push(obj)
    // }
    // console.log(tabularData)
  })
      return (
        <div>

        <TableContainer component={Paper}>
        <Table aria-aria-label='sample table'>
        <TableHead>
        
        <TableRow>
        
        <TableCell align='center'><strong>Aspect</strong></TableCell>
        <TableCell align='center'><strong>Feature 1</strong></TableCell>
        <TableCell align='center'><strong>Feature 2</strong></TableCell>
        <TableCell align='center'><strong>Feature 3</strong></TableCell>
        <TableCell align='center'><strong>Feature 4</strong></TableCell>
        <TableCell align='center'><strong>Feature 5</strong></TableCell>
        <TableCell align='center'><strong>Overall Sentiment</strong></TableCell>
        </TableRow>
        
        </TableHead>
        <TableBody>
        {
          tabularData.map((row)=>(
            <TableRow
            key={row.id}
            sx={{'&:last-child td, &:last-child th': {border: 0}}}>
            <TableCell align='center'>{row.Aspect}</TableCell>
            <TableCell align='center'>{row.Feature_1}</TableCell>
            <TableCell align='center'>{row.Feature_2}</TableCell>
            <TableCell align='center'>{row.Feature_3}</TableCell>
            <TableCell align='center'>{row.Feature_4}</TableCell>
            <TableCell align='center'>{row.Feature_5}</TableCell>
            <TableCell align='center'>{row.Overall_Sentiment}</TableCell>
            
            </TableRow>

        ))
        }
        </TableBody>
        
        
        </Table>
        
        </TableContainer>

        <br>
        </br>
        <br>
        </br>

        <p><strong></strong>The overall summary from reviews are,camera perfect,batteries bad,prices worth,product bad,overall positive product</p>
        
        </div>
      );
  }
}
function ViewReviews() {
  
    
}

export default Tablegenerate