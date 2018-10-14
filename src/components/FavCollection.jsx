import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { colors } from '../components/ColorDefs'
import { css } from 'emotion'
import styled from 'react-emotion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
let $ = require('jquery')


const Wrapper = styled('div')`
  position: relative;
  background: ${colors.darkGrey};
  height: 100%;
`
const emptyState = css`
  color: ${colors.lightGreen};
  text-align: center;
  padding-top: 20px;
`
const ImageStrip = styled('section')`
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
`
const ThumbWrapper = styled('div')`
  display: inline-flex;
  justify-content: flex-start;
`
const Figure = styled('figure')`
  width: 100%;
`
const TrashMask  = styled('div')`
  position: absolute;
  top: 9px;
  right: 0;
  display: block;
  width: 69px;
  height: 100px;
  overflow: hidden;
`
const TrashBtn = styled('button')`
  color: black;
  font-size: 27px;
  background-color: white;
  width: 49px;
  height: 43px;
  border-radius: 14px 0 0 14px;
  padding-left: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
  box-shadow: 3px 0px 21px 5px rgba(0,0,0,0.6);
  &:link,
  &:visited {
    color: black;
  }
  &:hover {
    color: red;
    text-decoration: none;
  }
  &:active {
    color: black;
  }
  &:focus {
    outline: 0;
  }
`

export default class FavCollection extends Component {

  componentDidMount() {
    // Add gradient only to mobile safari - compensate for bottom tray overlaying bottom area
    const userAgent = window.navigator.userAgent;
    if ((userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) && userAgent.indexOf("CriOS")===-1) {
      $('.wrapper').css('background', colors.darkGreyGradientBg) 
    }
  }

  resetImageStrip() {
    if (document.getElementsByClassName('imageStrip').length > 0)  {
      document.getElementsByClassName('imageStrip')[0].scrollTo(0, 0)
    }
  }

  render() {

    let favoritesExist = this.props.favCollection && Object.keys(this.props.favCollection).length > 0

    // Reverse keys order, picures show up to the left not right of strip
    let reverseKeyList = favoritesExist ? Object.keys(this.props.favCollection).reverse() : null

    return (
      <Wrapper className="wrapper">
        {favoritesExist ? (
          <ImageStrip className="imageStrip">
            <ThumbWrapper>
              {reverseKeyList.map((key, index) => (
                  <Figure onClick={()=>this.props.onPictureSelect(this.props.favCollection[key])} key={key}>
                    <img src={this.props.favCollection[key].images.fixed_height_small.url} alt="" />
                  </Figure>
                )
              )}
            </ThumbWrapper>
          </ImageStrip>
        ) : (
          <h2 className={emptyState}>ENTER SEARCH TERM<br />SELECT WHITE DOT TO ADD GIF</h2>
        )}
        {favoritesExist && (
          <TrashMask>
            <TrashBtn onClick={this.props.onTrashSelect}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </TrashBtn>
          </TrashMask>
        )}
      </Wrapper>
    )
  }
}

FavCollection.propTypes = {
  favCollection: PropTypes.object,
  onPictureSelect: PropTypes.func,
  handleFormSubmit: PropTypes.func
}
