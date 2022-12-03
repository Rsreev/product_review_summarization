import React from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Toolbar } from '@mui/material'

const Wrapper = styled.div`
  width: 625px;
  height: 50px;
  border-radius: 5px;
  background-color: #ffffff;
  font-size: 24px;

  display: flex;
  align-content: center;
  justify-content: center;
`;
const SearchIcon = styled.i.attrs({
    className: 'fa fa-search',
  })`
    color: #5c5c5c;
    width: 25px;
    padding: 10px;
  `;

const BigTextInput = styled.input.attrs({
    type: 'text',
  })`
    flex: 1;
    width: 200px;
    color: rgba(123, 123, 123, 0.78);
    font-size: 15px;
    float: left;
    border: none;
    border-radius: 5px;
  `;

const SearchInput = () => {
  return (
    <div>
    <Wrapper>
          <SearchIcon />
          <BigTextInput
            name="searchText"
            placeholder="Search products by name"
            // defaultValue={this.props.searchText || ''}
            // onBlur={this.onBlur}
          />
        </Wrapper>
    </div>
  )
}

export default SearchInput