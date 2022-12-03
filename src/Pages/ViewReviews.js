import React, {Component, state} from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper} from '@mui/material'
import { getAllUsers, summarizeReviews} from '../services/getData'
import Records from '../reviews.json'

class Tablegenerate extends Component {
  constructor(props) {
    super(props);
    this.state = {tabularData :[],summary:""};
  }
  componentDidMount() {
    var heading = this.props.heading;
    var body = this.props.body;
    const addrev = Object.keys(Records)
const viewReview = JSON.stringify(Records)
const rev = JSON.parse(viewReview)
let text=Object.values(rev)
    let data = [];
  let str = "";
  for(let i=1;i<29;i++){
    data.push(text[0]["content"+i])
    str+=text[0]["content"+i]+" "
  }
    getAllUsers(data).then((data) => {
    
     
        let tabularDataArr = [];
       for(const property in data){
         let obj = {};
         obj["Aspect"] = property
         obj["Feature_1"] = data[property][0]
         obj["Feature_2"] = data[property][1]
         obj["Feature_3"] = data[property][2]
         obj["Overall_Sentiment"] = data[property][3]
         tabularDataArr.push(obj)
       }
       //this.state.tabularData = tabularData
       this.setState({ tabularData: tabularDataArr });
    })
    summarizeReviews(str).then((data) => {
      this.setState({ summary: data.data });
     
    })
  }
  render() {
     
  
   let test = 0;
   
 
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
        <TableCell align='center'><strong>Overall Sentiment</strong></TableCell>
        </TableRow>
        
        </TableHead>
        <TableBody>
        {
          this.state.tabularData.map((row)=>(
            <TableRow
            key={row.id}
            sx={{'&:last-child td, &:last-child th': {border: 0}}}>
            <TableCell align='center'>{row.Aspect}</TableCell>
            <TableCell align='center'>{row.Feature_1}</TableCell>
            <TableCell align='center'>{row.Feature_2}</TableCell>
            <TableCell align='center'>{row.Feature_3}</TableCell>
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

        <p><strong>{this.state.summary}</strong></p>
        
        </div>
      );
  }
}
function ViewReviews() {
  
    
}

export default Tablegenerate