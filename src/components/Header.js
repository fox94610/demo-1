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
  cursor: pointer;
`

export default class Header extends Component {

  constructor(props) {
    super(props)

    let searchString = ''
    if(window.location.search !== '') {
      let key = window.location.search.substring(1, window.location.search.indexOf('='))
      if (key === 'search') {
        searchString = window.location.search.substring(window.location.search.indexOf('=')+1, window.location.search.length)
        console.log(searchString)
      }
    }
    this.state = {
      searchString
    }
    this.inputChangeHandler = this.inputChangeHandler.bind(this)
  }

  componentDidMount() {
    // Prepopulated search term via URL? Command search
    if (this.state.searchString !== '') {
      setTimeout(() => this.props.handleFormSubmit(this.state.searchString), 1000)
    }
  }

  inputChangeHandler = (evt) => this.setState({searchString: evt.target.value})

  render() {
    return (
      <Wrapper>
        <Title>ANIMATED GIF SELECTOR</Title>
        <FormTag>
          <TextField
            className="search-input"
            type="text"
            placeholder="Enter search term"
            onChange={this.inputChangeHandler}
            value={this.state.searchString}
          />
          <Button
            className="submit-btn"
            type="submit"
            value="Submit"
            onClick={(e) => {
              e.preventDefault();
              this.props.handleFormSubmit(this.state.searchString)
            }}
          />
        </FormTag>
      </Wrapper>
    )
  }
}

Header.propTypes = {
  handleFormSubmit: PropTypes.func
}

