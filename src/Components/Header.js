import React from 'react';
import './Header.css';
import SearchInput from './SearchInput';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

// export const Row = styled.div`
//   box-sizing: content-box;
//   width: 1152px;
//   padding: 0 15px;
//   margin: 0 auto;
// `;

// const FlexRow = Row.extend`
//   display: flex;
//   align-items: center;
// `;

// const HeaderLink = styled(Link)`
//   width: 290px;
//   color: #ffffff;
//   font-size: 36px;
//   font-weight: 900;
//   line-height: 33px;
//   text-decoration: none;

//   &:hover {
//     color: #f5f5f5;
//   }
// `;
const Header = () => (
  <div className="header">
  <h1> Review Summarization</h1>
  </div>
)
export default Header;