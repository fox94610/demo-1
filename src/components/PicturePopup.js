import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import { colors } from '../components/ColorDefs'
import $ from 'jquery'

const BackgroundTint = styled('div')`
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  opacity: .6;
`
const CloseBtn = styled('button')`
  position: absolute;
  width: 32px;
  height: 32px;
  right: 18px;
  top: 18px;
  border: 0;
  padding: 0;
  background: none;
`
const Box = styled('div')`
  position: fixed;
  z-index: 3;
  top: 17px;
  left: 17px;
  right: 17px;
  bottom: 17px;
  background-color: white;
  text-align: center;
  padding: 10px 10px 10px;
  @media (min-width: 576px) {
    top: 5%;
    bottom: 5%;
    left: 50%;
    width: 70%;
    max-width: 800px;
    transform: translate(-50%);
    padding: 0 40px;
  }
`
// negative margin to compensate for title and button heights
const Layout = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  margin-top: -26px;
`
const Figure = styled('figure')`
  position: relative;
  margin: 0;
  height: 70%;
`
const Figcaption = styled('figcaption')`
  line-height: 18px;
  font-weight: 500;
  padding-top: 10px;
  @media (min-width: 576px) {
    margin: 0 auto;
  }
`
const Detail = styled('span')`
  font-size: 12px;
  color: black;
`
const DetailValue = styled('span')`
  font-size: 12px;
  color: ${colors.grey};
`
const Options = styled('div')`
  font-size: 12px;
  margin-top: 9px;
    > button {
      inline-block
      font-weight: 700;
      background-color: black;
      padding: 3px 8px;
      margin: 0 6px;
    }
`

export default class PicturePopup extends Component {

  constructor(props) {
    super(props)
    this.resizeTimeout = null
    this.windowResizeHandler = this.windowResizeHandler.bind(this)
    this.setFigureLayout = this.setFigureLayout.bind(this)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.windowResizeHandler, false)
  }

  componentDidMount() {
    window.addEventListener("resize", this.windowResizeHandler, false)
    this.setFigureLayout()
  }

  setFigureLayout() {

    // Get constrained picture wi/ht
    let originalW = this.props.data.images.downsized.width
    let originalH = this.props.data.images.downsized.height
    let containerW = $(`.figure-${this.props.data.id}`).width()
    let containerH = $(`.figure-${this.props.data.id}`).height()
    let picWi = Math.round((originalW * containerH) / originalH)
    let picHt = Math.round((containerW * originalH) / originalW)

    if (picHt < containerH) {
      // Restricted by left/right
      $(`.gif-${this.props.data.id}`).height(picHt);
      $(`.gif-${this.props.data.id}`).width(containerW);
      // Center picture vertically
      let pushToCenter = (containerH - picHt) * 0.5
      $(`.gif-${this.props.data.id}`).css('margin-top', pushToCenter+'px')
    } else {
      // Restricted by top/bottom
      $(`.gif-${this.props.data.id}`).width(picWi);
      $(`.gif-${this.props.data.id}`).height(containerH);
    }
  }

  windowResizeHandler() {
    const self = this
    if (!this.resizeTimeout) {
      this.resizeTimeout = setTimeout(function() {
        self.resizeTimeout = null
        self.setFigureLayout()
       // execute at approx 15fps
       }, 66)
    }
  }

  render() {

    // Previously favorited
    let hasBeenFaved = false
    if (this.props.favCollection) {
      hasBeenFaved = this.props.favCollection.hasOwnProperty(this.props.data.id)
    }

    return (
      <Fragment>
        <BackgroundTint onClick={this.props.onPopCloseSelect}/>
        <Box>
          <Layout>
            <Figure className={`figure-${this.props.data.id}`}>
              <img className={`gif-${this.props.data.id}`} src={this.props.data.images.downsized.url} alt={this.props.data.title} />
              <Figcaption className="figcaption">

                {this.props.data.title && (
                  <div>{this.props.data.title.toUpperCase()}</div>
                )}

                <Fragment>
                  <Detail>BY:</Detail>
                  <DetailValue>
                    {this.props.data.username ? (
                      <span> {this.props.data.username.toUpperCase()}</span>
                    ) : (
                      <span> UNKNOWN</span>
                    )}
                  </DetailValue>
                </Fragment>

                {this.props.data.rating && (
                  <Fragment>
                    <Detail>, RATED: </Detail>
                    <DetailValue>{this.props.data.rating.toUpperCase()}</DetailValue>
                  </Fragment>
                )}

              </Figcaption>
              <Options className="options">
                <button onClick={(e)=>this.props.onFavBtnSelect(e, this.props.data)}>
                  {hasBeenFaved ? `REMOVE FAVORITE` : `ADD FAVORITE`}
                </button>
                <button>
                  <a href={this.props.data.bitly_url} target="_blank" rel="noopener noreferrer">SEE ON GIPHY</a>
                </button>
              </Options>
            </Figure>
          </Layout>

          <CloseBtn onClick={this.props.onPopCloseSelect}>
            <img src={require('../assets/img/close-btn.svg')} alt="Close button" />
          </CloseBtn>
        </Box>
      </Fragment>
    )
  }
}

PicturePopup.propTypes = {
  data: PropTypes.object,
  onPopCloseSelect: PropTypes.func,
  favCollection: PropTypes.object,
  onFavBtnSelect: PropTypes.func
}
