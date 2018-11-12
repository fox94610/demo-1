import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'

const Wrapper = styled('div')`
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  display: inline-block;
  background: #daf2e7;
  box-shadow: 0px 4px 27px -1px rgba(0,0,0,0.68);
  width: 100%;
  height: 100%;
  letter-spacing: 1.1px;
  text-align: center;
`
const FormTag = styled('form')`
  display: inline-block;
`
const Title = styled('h1')`
  font-size: 16px;
  font-weight: 500;
  padding: 5px 0;
  margin: 0
`
const TextField = styled('input')`
  width: 220px;
`
const Button = styled('input')`
  border: 1px solid grey;
  border-radius: 0px;
  background-color: white;
  height: 30px;
`

export default class Header extends Component {

  render() {
    return (
      <Wrapper>
        <Title>ANIMATED GIF SELECTOR</Title>
        <FormTag>
          <TextField
            className="search-input"
            type="text"
            placeholder="Enter search term"
            onChange={()=>{}}
          />
          <Button
            className="submit-btn"
            type="submit"
            value="Submit"
            onClick={this.props.handleFormSubmit}
          />
        </FormTag>
      </Wrapper>
    )
  }
}

Header.propTypes = {
  handleFormSubmit: PropTypes.func
}

